# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
from statistics import median

# Install these if needed: pip install pylsl numpy scipy
from pylsl import StreamInlet, resolve_streams
import numpy as np
from scipy.signal import welch

print("Resolving all LSL streams...")
streams = resolve_streams()  # Get all available streams

# Loop through available streams and pick the one with type "EEG"
inlet = None
for s in streams:
    if s.type() == "EEG":
        inlet = StreamInlet(s)
        print("Connected to EEG stream:", s.name())
        break

if inlet is None:
    print("No EEG stream of type 'EEG' found. Make sure the CGX device is streaming via LSL.")

app = FastAPI()

# Allow cross-origin requests so that your frontend can call these APIs.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Global State
# --------------------
running = False            # Whether we're currently reading data from LSL
data_buffer = []           # Storage for recent EEG samples (each sample is a list of channel values)
cog_load = 0.0             # Current cognitive load value (last computed)
SAMPLE_RATE = 500          # Approximate sampling rate

# For session feedback
cog_load_history = []      # Stores each computed cognitive load during the session
start_time = None          # When EEG started
stop_time = None           # When EEG stopped

# --------------------
# Reading Thread
# --------------------
def read_eeg_thread():
    global running, data_buffer, cog_load, cog_load_history, inlet
    while running and inlet:
        # Try to pull the newest sample (non-blocking)
        sample, timestamp = inlet.pull_sample(timeout=0.0)
        if sample:
            data_buffer.append(sample)
            # Once we have one second of samples, compute cognitive load
            if len(data_buffer) >= SAMPLE_RATE:
                window_data = np.array(data_buffer[-SAMPLE_RATE:])
                cog_load = compute_cognitive_load(window_data)
                cog_load_history.append(cog_load)
        time.sleep(0.001)  # tiny sleep to avoid busy-wait

# --------------------
# Cognitive Load Calculation
# --------------------
def compute_cognitive_load(eeg_data):
    """
    Compute the ratio of Beta band power to Alpha band power using channel 0.
    eeg_data is expected to have shape (samples, channels).
    """
    channel0 = eeg_data[:, 0]  # use first channel for demo
    f, psd = welch(channel0, fs=SAMPLE_RATE, nperseg=256)
    # Define frequency bands
    alpha_idx = np.where((f >= 8) & (f <= 12))
    beta_idx  = np.where((f >= 13) & (f <= 30))
    alpha_power = np.sum(psd[alpha_idx])
    beta_power  = np.sum(psd[beta_idx])
    if alpha_power == 0:
        return 0.0
    return float(beta_power / alpha_power)

# --------------------
# FastAPI Endpoints
# --------------------
@app.get("/")
def root():
    return {"message": "EEG server is running."}

@app.get("/start-eeg")
def start_eeg():
    """
    Start reading EEG data from LSL and record the session start time.
    """
    global running, start_time, cog_load_history, data_buffer
    if not running:
        running = True
        start_time = time.strftime("%H:%M:%S")
        # Reset session data
        cog_load_history = []
        data_buffer = []
        t = threading.Thread(target=read_eeg_thread, daemon=True)
        t.start()
    return {"status": "EEG started", "start_time": start_time}

@app.get("/stop-eeg")
def stop_eeg():
    """
    Stop reading EEG data, record the session stop time,
    compute summary feedback based on the median cognitive load,
    and return a feedback message.
    """
    global running, stop_time, cog_load_history
    running = False
    stop_time = time.strftime("%H:%M:%S")
    
    if cog_load_history:
        med_cog = median(cog_load_history)
    else:
        med_cog = 0.0

    # Define a threshold for feedback (adjust as needed)
    threshold = 1.0
    if med_cog > threshold:
        feedback = f"High cognitive load detected (median = {med_cog:.2f})."
    else:
        feedback = f"Low cognitive load detected (median = {med_cog:.2f})."
    
    feedback_message = {
        "feedback": feedback,
        "start_time": start_time,
        "stop_time": stop_time,
        "median_cognitive_load": med_cog
    }
    
    return {"status": "EEG stopped", "feedback": feedback_message}

@app.get("/realtime")
def realtime():
    """
    Return the most recent EEG data (last 20 samples) and the current cognitive load.
    """
    global data_buffer, cog_load
    last_samples = data_buffer[-20:] if len(data_buffer) > 20 else data_buffer
    return {
        "eeg": last_samples,
        "cognitive_load": cog_load
    }

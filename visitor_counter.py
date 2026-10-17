import datetime

def log_visit():
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{current_time}] Kunjungan baru tercatat pada portofolio Mountain Indonesia.\n"
    
    with open("visitor_log.txt", "a") as f:
        f.write(log_message)
    print("Log kunjungan berhasil dicatat oleh Python.")

if __name__ == "__main__":
    print("--- Sistem Logger Python Berjalan ---")
    log_visit()
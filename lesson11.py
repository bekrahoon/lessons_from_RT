import sounddevice as sd
from scipy.io.wavfile import write, read
import numpy as np
import os
import tkinter as tk
from tkinter import filedialog, messagebox
import threading
from scipy.fft import rfft, rfftfreq

# ========================== Dictaphone ==========================
class Dictaphone:
    def __init__(self, sample_rate=44100, channels=1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.audio_data = None
        self.is_recording = False
    
    def record(self, duration=None):
        self.is_recording = True
        print('Начата запись....')

        if duration:
            # Запись фиксированной длительности
            self.audio_data = sd.rec(int(duration * self.sample_rate), 
                                    samplerate=self.sample_rate, 
                                    channels=self.channels)
            sd.wait()
            self.is_recording = False
            print('Запись завершена')
        else:
            # Запись без duration через поток
            self.audio_data = []  # Инициализируем как список
            with sd.InputStream(samplerate=self.sample_rate, 
                                channels=self.channels, 
                                callback=self.callback):
                while self.is_recording:
                    sd.sleep(100)

    def callback(self, indata, frames, time, status):
        if isinstance(self.audio_data, list):
            self.audio_data.append(indata.copy())

    
    def stop(self):
        self.is_recording = False
        if isinstance(self.audio_data, list):
            self.audio_data = np.concatenate(self.audio_data, axis=0)
        print('Запись остановлена')
    
    def save(self, filename='output.wav'):
        if self.audio_data is not None:
            write(filename, self.sample_rate, (self.audio_data * 32767).astype(np.int16))
            print(f'Файл сохранен как: {filename}')
        else:
            print('Нет данных для сохранения....')

# ========================== Animal Recognizer ==========================
class AnimalRecognizer:
    def __init__(self):
        # Папка с эталонными звуками
        self.samples = {
            'Собака': 'samples/dog.wav',
            'Кот': 'samples/cat.wav'
        }
        self.sample_freqs = {}
        self.load_samples()
    
    def load_samples(self):
        for name, path in self.samples.items():
            if os.path.exists(path):
                rate, data = read(path)
                if data.ndim > 1:  # Если стерео
                    data = data[:, 0]
                fft = np.abs(rfft(data))
                self.sample_freqs[name] = fft
            else:
                print(f"Эталонный файл не найден: {path}")
    
    def predict(self, file_path):
        rate, data = read(file_path)
        if data.ndim > 1:
            data = data[:, 0]
        fft = np.abs(rfft(data))
        
        # Простое сравнение через корреляцию
        best_match = None
        best_score = -1
        for name, sample_fft in self.sample_freqs.items():
            # Сделаем корреляцию с эталоном
            min_len = min(len(sample_fft), len(fft))
            score = np.corrcoef(sample_fft[:min_len], fft[:min_len])[0, 1]
            if score > best_score:
                best_score = score
                best_match = name
        
        return best_match

# ========================== GUI ==========================
class DictaphoneApp:
    def __init__(self, master):
        self.master = master
        master.title('Диктофон + Распознавание животных')
        master.geometry('640x420')

        self.dictaphone = Dictaphone()
        self.recognizer = AnimalRecognizer()
        self.filename = None

        self.record_btn = tk.Button(master, text='Record', command=self.start_recording)
        self.record_btn.pack(pady=5)

        self.stop_btn = tk.Button(master, text='Stop', command=self.stop_recording)
        self.stop_btn.pack(pady=5)

        self.save_btn = tk.Button(master, text='Save', command=self.save_recording)
        self.save_btn.pack(pady=5)

        self.predict_btn = tk.Button(master, text='Recognize Animal', command=self.recognize_animal)
        self.predict_btn.pack(pady=5)

        self.result_label = tk.Label(master, text='', font=('Arial', 16))
        self.result_label.pack(pady=10)

    def start_recording(self):
        thread = threading.Thread(target=self.dictaphone.record)
        thread.start()

    def stop_recording(self):
        self.dictaphone.stop()

    def save_recording(self):
        filename = filedialog.asksaveasfilename(defaultextension='.wav', filetypes=[("WAV files", '*.wav')])
        if filename:
            self.dictaphone.save(filename)
            self.filename = filename

    def recognize_animal(self):
        if not self.filename:
            messagebox.showwarning("Ошибка", "Сначала сохраните запись")
            return
        animal = self.recognizer.predict(self.filename)
        self.result_label.config(text=f'Определено: {animal}')

# ========================== MAIN ==========================
if __name__ == '__main__':
    root = tk.Tk()
    app = DictaphoneApp(root)
    root.mainloop()

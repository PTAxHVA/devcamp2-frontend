import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

# 1. Load file âm thanh
file_path = "./output/IN THE SEA - Kensuke Ushio - Chainsaw Man_ Reze Arc - Violin Cover_violin.wav" 
# Lưu ý: Nếu file dài, librosa sẽ load hơi lâu. Nên test với file < 1 phút.
y, sr = librosa.load(file_path, sr=None) 

print(f"Sample Rate (Tần số lấy mẫu): {sr} Hz")
print(f"Thời lượng: {len(y) / sr:.2f} giây")

# 2. Vẽ Waveform (Sóng âm)
plt.figure(figsize=(12, 8))
plt.subplot(2, 1, 1)
librosa.display.waveshow(y, sr=sr, color='blue')
plt.title('Waveform (Biên độ sóng âm)')
plt.xlabel('Thời gian (s)')
plt.ylabel('Biên độ')

# 3. Vẽ Spectrogram (Phổ tần số)
plt.subplot(2, 1, 2)
# Chuyển đổi tín hiệu sang dạng phổ (STFT)
D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log', cmap='magma')
plt.colorbar(format='%+2.0f dB')
plt.title('Spectrogram (Phổ tần số - Giúp nhìn rõ dải tần của Violin/Piano)')

plt.tight_layout()
plt.show()

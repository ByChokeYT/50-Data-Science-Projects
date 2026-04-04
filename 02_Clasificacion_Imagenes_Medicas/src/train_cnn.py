import os
import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split

print("==================================================")
print("🩻 PROYECTO 2: CLASIFICACIÓN DE IMÁGENES MÉDICAS (CNN PyTorch)")
print("==================================================\n")

# Configuración Global
IMG_SIZE = 128
SAMPLES_PER_CLASS = 50 # Reducido severamente para demo rápida
CLASSES = ["Sano", "Anomalia_Radiologica"]
BATCH_SIZE = 16
EPOCHS = 5

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# 1. Pipeline de Datos Sintético (Mock de Kaggle Chest X-Ray)
print("[+] 1. Generando Dataset Radiológico de Prueba (Matriz Tensorial)...")

X_data = []
y_labels = []

def generate_mock_xray(is_anomaly=False):
    # Fondo gris que simula tejido pulmonar en rayos X
    base = np.random.normal(100, 20, (IMG_SIZE, IMG_SIZE)).astype(np.uint8)
    base = cv2.GaussianBlur(base, (5, 5), 0)
    
    if is_anomaly:
        # Inserta manchas densas (tumores/infecciones focales)
        y_pos, x_pos = np.random.randint(30, IMG_SIZE-30, 2)
        cv2.circle(base, (x_pos, y_pos), radius=np.random.randint(15, 30), color=(180, 180, 180), thickness=-1)
        base = cv2.GaussianBlur(base, (11, 11), 0)
        
    return base

for class_idx, class_name in enumerate(CLASSES):
    for i in range(SAMPLES_PER_CLASS):
        img = generate_mock_xray(is_anomaly=(class_idx == 1))
        # Normalizar tensores a Float32 entre 0 y 1
        img_normalized = img.astype('float32') / 255.0
        X_data.append(img_normalized)
        y_labels.append(class_idx)

# Shape PyTorch es distinto a Keras: (Bacth, Canales, Alto, Ancho)
X_data = np.array(X_data).reshape(-1, 1, IMG_SIZE, IMG_SIZE)
y_labels = np.array(y_labels, dtype=np.float32).reshape(-1, 1)

print(f"    - Total radiografías procesadas: {len(X_data)}")
print(f"    - Geometría Tensor Entrada (N, C, H, W): {X_data.shape}\n")

# 2. Separación Entrenamiento VS Prueba
print("[+] 2. Segmentando Validación: Entrenamiento (80%) y Prueba Invisible (20%)...")
X_train, X_test, y_train, y_test = train_test_split(X_data, y_labels, test_size=0.2, random_state=42)

# Convertir Numpy a Tensores PyTorch y crear flujos de carga paralela
train_dataset = TensorDataset(torch.tensor(X_train), torch.tensor(y_train))
test_dataset = TensorDataset(torch.tensor(X_test), torch.tensor(y_test))

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# 3. Topología Convolucional (PyTorch nn.Module)
print("[+] 3. Compilando Arquitectura Convolucional profunda...\n")

class XRayCNN(nn.Module):
    def __init__(self):
        super(XRayCNN, self).__init__()
        # Bloques Extractores de Características
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1)
        
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5) # Prevención de Overfitting
        
        # Cada capa MaxPool reduce la imagen a la mitad.
        # 128 -> 64 -> 32 -> 16. La base plana será de 64 filtros x 16 x 16.
        self.fc1 = nn.Linear(64 * 16 * 16, 64)
        self.fc2 = nn.Linear(64, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Flujo Computacional hacia adelante (Forward Propagation)
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.pool(self.relu(self.conv3(x)))
        
        x = torch.flatten(x, 1) # Aplanar a vector 1D
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return self.sigmoid(x)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = XRayCNN().to(device)
print(f"    - Hardware Activo para Inferencia: {device}")

# Motor de Optimización y Función de Coste
criterion = nn.BCELoss() # Entropía cruzada binaria
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 4. Entrenamiento de IA
print("\n[+] 4. Iniciando Entrenamiento Computacional (Backpropagation)...")

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        
        optimizer.zero_grad() # Resetear gradientes de epoch anterior
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        
        loss.backward() # Calcular gradientes (Aprender del error)
        optimizer.step()  # Aplicar la actualización de pesos
        
        running_loss += loss.item()
        
        # Interpretar eficacia
        predicted = (outputs > 0.5).float()
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
    epoch_acc = (correct / total) * 100
    print(f"    - Época {epoch+1}/{EPOCHS} -> Error (Loss): {running_loss/len(train_loader):.4f} | Precisión: {epoch_acc:.2f}%")

# 5. Validación
print("\n[+] 5. Midiendo Eficacia Analítica con Placas de Prueba Múltiples...")
model.eval() # Activar modo evaluación (Desactiva el Dropout)
test_loss = 0.0
correct = 0
total = 0

with torch.no_grad(): # Desactivar cálculo de gradientes para ahorrar memoria viva
    for inputs, labels in test_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        test_loss += loss.item()
        
        predicted = (outputs > 0.5).float()
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

test_acc = (correct / total) * 100
print("================ RESULTADOS ======================")
print(f"✅ Exactitud Médica Diagnóstica (Datos Crudos): {test_acc:.2f}%")
print("==================================================")

# 6. Almacenamiento
model_path = os.path.join(MODELS_DIR, 'modelo_rayosx_cnn.pth')
print(f"\n[+] 6. Eyectando Red Neuronal Compilada a disco duro...")
torch.save(model.state_dict(), model_path)
print(f"    ✅ Guardado absoluto: '{model_path}'. ¡Lista para Servidor Inferencia API!")

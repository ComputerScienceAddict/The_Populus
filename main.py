import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd

import pickle
from sklearn.model_selection import train_test_split

# Load the dataset
data = pd.read_csv("spam.csv", encoding="ISO-8859-1")

# Extract tweets and labels
text = data['v2']
labels = data['v1']

# Convert multiclass labels to binary (e.g., 0 = hate speech, 1 = others)


# ham = 1, Spam = 0
binary_labels = labels.apply(lambda x: 1 if x == "ham" else 0).values

# Tokenize the tweets
tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=5000)
tokenizer.fit_on_texts(text)
sequences = tokenizer.texts_to_sequences(text)
padded_sequences = pad_sequences(sequences, maxlen=50)


with open("tokenizer.pkl", "wb") as file:
    pickle.dump(tokenizer, file)

# Split into training and testing sets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(padded_sequences, binary_labels, test_size=0.2, random_state=42)

model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=5000, output_dim=64, input_length=50),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=10, batch_size=32, validation_split=0.1)

loss, accuracy = model.evaluate(X_test, y_test)


model.save("spamModel.h5")


print(f"Test Accuracy: {accuracy:.2f}")

# Test the model with a new tweet
test_tweet = ["hello, please call my number for consultation"]
test_seq = tokenizer.texts_to_sequences(test_tweet)
test_padded = pad_sequences(test_seq, maxlen=50)
prediction = model.predict(test_padded)[0][0]
print(f"Prediction (1=Not-Spam, 0=Spam): {prediction:.2f}")

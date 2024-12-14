from flask import Flask, jsonify, send_from_directory, request
import pandas as pd
import threading
import time
import os

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

from flask_cors import CORS
CORS(app)

# Global comments database
comments_db = {}

def countdown_timer(seconds):
    """Countdown timer that prints the time left every second."""
    while seconds > 0:
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds_remaining = divmod(remainder, 60)
        print(f"{hours:02}:{minutes:02}:{seconds_remaining:02}", end='\r')
        time.sleep(1)
        seconds -= 1  # Corrected placement of the decrement
    print("\nTime's up! 24 hours completed!")

def read_data():
    """Reads data from a CSV file and handles missing values."""
    try:
        df = pd.read_csv("articles.csv")
        df.fillna("Not Available", inplace=True)
        return df
    except Exception as e:
        print(f"Error reading the CSV file: {e}")
        return pd.DataFrame()

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'downloaded_images'), filename)

@app.route("/members")
def members():
    """Endpoint to return article data with image links."""
    df = read_data()

    # Create image URL links for each article based on the filename
    base_url = "http://localhost:5000/images/"

    combined_data = {
        "comments": comments_db,
        "Title": df['Title'].tolist(),
        "Description": df['Description'].tolist(),
        "URL": df['URL'].tolist(),
        "Full_Article_Text": df['Full_Article_Text'].tolist(),
        "Image_path_link": df['Image_path_link'].tolist(),  # This will return image URLs
        "Tag": df['Tag'].tolist(),
        'Index': df['Index'].tolist(),
        "picture": ['C:/Users/compu/Documents/Civitas/flask-server/downloaded_images/asciiart.png']
    }
    return jsonify(combined_data)

@app.route("/comments/<int:thread_id>", methods=["GET", "POST"])
def handle_comments(thread_id):
    """
    GET: Retrieve comments for a specific thread.
    POST: Add a new comment to a specific thread.
    """
    if request.method == "GET":
        # Return comments for the thread
        thread_comments = comments_db.get(thread_id, [])
        return jsonify(thread_comments)

    if request.method == "POST":
        # Add a new comment
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Invalid data"}), 400

        new_comment = {
            "id": len(comments_db.get(thread_id, [])) + 1,
            "text": data["text"],
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "profilePicture": data.get("profilePicture", "http://localhost:5000/images/default-avatar.png"),
            "replies": data.get("replies", []),
        }
        comments_db.setdefault(thread_id, []).append(new_comment)
        return jsonify(new_comment), 201

if __name__ == "__main__":
    ##timer_thread = threading.Thread(target=countdown_timer, args=(86400,))  # 86400 seconds = 24 hours
    ##timer_thread.start()  # Start the countdown timer in a separate thread

    app.run(debug=True)  # Start the Flask app with debug mode enabled

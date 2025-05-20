from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
model = joblib.load('crop_prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Prepare input as DataFrame
    input_df = pd.DataFrame([{
        'Crop': data['crop'],
        'Month_Num': data['month'],
        'Total_Area': data['area'],
        'Total_Wasted': data['wasted'],
        'Total_Shortfall': data['shortfall'],
        'Avg_Price': data['price']
    }])

    # Predict
    prediction = model.predict(input_df)
    
    return jsonify({
        'predicted_planted_amount': round(prediction[0], 2)
    })

if __name__ == '__main__':
    app.run(debug=True)

import pandas as pd
import os

def split_nilm_data(input_file, rows_per_user=50000, n_users=2):
    print(f"Reading {input_file}...")
    # Read the data. We only need enough rows to satisfy both users.
    # Reading header + total rows needed.
    total_needed = rows_per_user * n_users
    
    try:
        # Load the dataset
        # The user provided CSV is 1475708700932.csv
        df = pd.read_csv(input_file, nrows=total_needed)
        
        for i in range(n_users):
            start_row = i * rows_per_user
            end_row = (i + 1) * rows_per_user
            user_df = df.iloc[start_row:end_row]
            
            output_file = f"user{i+1}_data.csv"
            user_df.to_csv(output_file, index=False)
            print(f"Saved {output_file} ({len(user_df)} rows)")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    csv_path = r'c:\Users\acer\Downloads\Nilm fl\1475708700932.csv'
    if os.path.exists(csv_path):
        split_nilm_data(csv_path)
    else:
        print(f"Source file not found at {csv_path}")

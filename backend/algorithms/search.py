def search(array, target):
    try:
        for index, value in enumerate(array):
            if value == target:
                return index 
        return -1 
    except Exception as e:
        print(f"Error in search algorithm: {e}")
        return -1

# 🐾 Flatacuties - Animal Voting App

A fun and interactive web application that lets you view, add, and vote for your favorite animals.

## ✨ Features

- **Browse Animals** - View a colorful catalog of animals with detailed information
- **Vote for Favorites** - Support animals with upvotes or express dissent with downvotes
- **Add New Animals** - Contribute to our growing collection
- **Responsive Design** - Enjoy a seamless experience on desktop, tablet, or mobile
- **Beautiful Interface** - Experience a visually appealing and intuitive design

## 🚀 Quick Start

### Prerequisites

- Node.js and npm installed on your system
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation & Setup

1. **Install the JSON Server**

   ```bash
   npm install -g json-server
   ```

2. **Launch the Backend Server**

   ```bash
   json-server --watch db.json --port 3000
   ```

3. **Open the Application**
   - Simply open the main HTML file in your web browser

## 🎮 How to Use

1. **Explore Animals** - Click on any animal in the list to view its details
2. **Cast Your Vote** -- buttons to influence scores
3. **Reset Scores** - Click "Reset Votes" to clear voting history for any animal
4. **Contribute** - Use the submission form to add new animals to our collection

## 🛠️ Customization

You can easily customize the animal database by modifying the JSON structure:

```json
{
  "characters": [
    {
      "id": 1,
      "name": "Animal Name",
      "image": "image-url.jpg",
      "votes": 0
    }
  ]
}
```

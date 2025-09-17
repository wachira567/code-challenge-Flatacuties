Flatacuties - Animal Voting App

Flatacuties is a simple web app where you can view animals, vote for your favorites, and even add new ones.

Features

Browse a list of animals with images and details

Vote animals up or down to change their score

Reset votes at any time

Add your own animals through a quick form

Works smoothly on desktop and mobile

Getting Started
Requirements

Node.js and npm installed

A modern web browser

Setup

Install JSON Server:

npm install -g json-server

Start the server:

json-server --watch db.json --port 3000

Open the main HTML file in your browser to run the app.

Usage

Select an animal from the list to see details.

Use the buttons to upvote, downvote, or reset votes.

Add new animals using the form at the bottom of the page.

Customization

You can edit the data by changing the db.json file. Example:

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

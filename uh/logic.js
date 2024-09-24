/*
  The formula I use is not the scientifically best formula.
  If you want more correct result use Kepler’s laws.
  Also I use center of circumcircle of ellipse because
  orbit of the earth is not too much ellipse, it's almost a circle
  and Sun is almost in the middle of the circle, you can use center of ellipse
*/

"use strict"

const earth = document.getElementById("earth")
const dateButton = document.getElementById("date")
const datePicker = document.getElementById("datePicker")
const ellipse = document.getElementById("ellipse")

var isPressing = false

const earthSize = 15
const horizontalRadius = 150
const verticalRadius = 73
const horizontalMargin = 25
const verticalMargin = 10

var today = new Date()
var year = today.getFullYear()
var start = new Date(today.getFullYear(), 0, 0)
var diff = today - start
const oneDay = 1000 * 60 * 60 * 24
var dayNumber = Math.floor(diff / oneDay)
var date = dateFromDay(dayNumber)
dateButton.children[0].innerText = addZero(date.getDate()) + "/" + addZero(date.getMonth()+1) + "/" + date.getFullYear()

var degree = 2*Math.asin(((dayNumber-1)/(182.5 + (isLeapyear()?0.5:0)))-1)
var x = horizontalRadius*Math.cos(degree)
var y = verticalRadius*Math.sin(degree)

earth.setAttribute("x",horizontalRadius + x - earthSize/2 + horizontalMargin)
earth.setAttribute("y",verticalRadius - y - earthSize/2 + verticalMargin)


earth.addEventListener("mousedown", mousedown)
earth.addEventListener("touchstart", mousedown)

addEventListener("mousemove", mousemove)
addEventListener("touchmove", mousemove)

addEventListener("mouseup", mouseup)
addEventListener("touchend", mouseup)


var dateButtonRect = dateButton.getBoundingClientRect()
datePicker.style.top = dateButtonRect.height + "px"
datePicker.style.right = 0
dateButton.style.height = dateButtonRect.height + "px"

function mousedown(e) {
  isPressing = true
}

function mousemove(e) {
  if(!isPressing)
    return
  
  const { clientX, clientY } = e.touches != null ? e.touches[0] : e
  
  const rect = ellipse.getBoundingClientRect()
  const ellipseCenterX = rect.x + rect.width/2 + horizontalMargin
  const ellipseCenterY = rect.y + rect.height/2 + verticalMargin
  degree = Math.atan2(ellipseCenterY - clientY, clientX - ellipseCenterX)

  let x = horizontalRadius*Math.cos(degree)
  let y = verticalRadius*Math.sin(degree)

  earth.setAttribute("x", horizontalRadius + x - earthSize/2 + horizontalMargin)
  earth.setAttribute("y", verticalRadius - y - earthSize/2 + verticalMargin)

  let oldDate = date

  var dayNumber = ((182.5 + (isLeapyear()?0.5:0))*(Math.sin((degree)/2) + 1) + 1)

  date = dateFromDay(dayNumber)

  if(oldDate.getDate() == 1 && oldDate.getMonth() == 0 && date.getDate() == 31 && date.getMonth() == 11){
    year--
  }else if(oldDate.getDate() == 31 && oldDate.getMonth() == 11 && date.getDate() == 1 && date.getMonth() == 0){
    year++
  }
  
  dayNumber = ((182.5 + (isLeapyear()?0.5:0))*(Math.sin((degree)/2)+1)+1)
  date = dateFromDay(dayNumber)

  if(date.getTime() > today.getTime()){
    dateButton.children[0].classList.add("future")
    dateButton.children[0].innerText = "You are not a time traveller by any chance nub" 
  }else{
    dateButton.children[0].classList.remove("future")
    dateButton.children[0].innerText = addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear()
  }
}

function dateFromDay(day){
  var date = new Date(year, 0)
  return new Date(date.setDate(day))
}

function mouseup(e) {
  isPressing = false
}

function addZero(num){
  return num<10?"0"+num:num
}

function isLeapyear(){
  return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0)
}
"use strict";

// Get elements
const termsBtn = document.getElementById("termsBtn");
const termsModal = document.getElementById("termsModal");
const typedTerms = document.getElementById("typedTerms");
const submitTerms = document.getElementById("submitTerms");
const signupBtn = document.getElementById("signupBtn");

const correctTerms = "I agree to the terms and conditions of this service and will adhere to all the policies stated.";
const termsArray = correctTerms.split(" "); // Split the terms into an array of words
let currentWordIndex = 0; // Keep track of which word the user is typing
let currentTyped = ""; // What the user has typed for the current word

// Show terms modal when clicking 'Read Terms and Conditions'
termsBtn.addEventListener("click", function () {
  termsModal.classList.remove("hidden");
  typedTerms.disabled = false; // Enable the text area for typing
  typedTerms.value = ""; // Clear the text area
  submitTerms.disabled = true; // Disable submit button initially
  currentWordIndex = 0; // Reset word index
  currentTyped = ""; // Reset current typed word
  setTimeout(() => {
    typedTerms.focus(); // Focus on textarea to show the cursor immediately
  }, 100);  // Delay slightly to allow rendering
  
  // Show first word to type
  displayWordPrompt();
  typedTerms.focus(); // Focus on the textarea
});

// Function to display the current word the user needs to type
function displayWordPrompt() {
  typedTerms.placeholder = `Type: ${termsArray[currentWordIndex]}`;
}

// Disable copy-paste on the textarea
typedTerms.addEventListener("copy", function (e) {
  e.preventDefault();
  alert("Don't be lazy! Type the terms manually.");
});

typedTerms.addEventListener("paste", function (e) {
  e.preventDefault();
  alert("Don't be lazy! Type the terms manually.");
});

// Listen for user typing in the textarea
typedTerms.addEventListener("input", function () {
  const typedValue = typedTerms.value.trim(); // Get the typed input
  const currentWord = termsArray[currentWordIndex]; // Get the current word to type

  // Check if the typed value matches the current word so far
  if (currentWord.startsWith(typedValue)) {
    // The user is typing correctly
    typedTerms.style.color = "black"; // Show text as normal
    currentTyped = typedValue; // Update the current typed value

    // If the user finishes typing the whole word correctly
    if (currentTyped === currentWord) {
      // Move to the next word
      currentWordIndex++;
      typedTerms.value = ""; // Clear the text area for the next word

      // If the user finishes all words correctly, enable submit
      if (currentWordIndex === termsArray.length) {
        submitTerms.disabled = false; // Enable submit button
        typedTerms.placeholder = "Well done! Click Submit to finish.";
      } else {
        // Otherwise, display the next word prompt
        displayWordPrompt();
      }
    }
  } else {
    // The user typed something incorrectly
    typedTerms.style.color = "red"; // Highlight incorrect text in red
  }
});

// Submit terms and ask for confirmation
submitTerms.addEventListener("click", function () {
  const userConfirmed = confirm("Are you really sure you want to sign up?");
  if (userConfirmed) {
    alert("Thank you! You can now sign up.");
    termsModal.classList.add("hidden"); // Hide modal
    signupBtn.disabled = false; // Enable signup button
  }
});

// Handle signup button click
signupBtn.addEventListener("click", function () {
  alert("You have successfully signed up!");
  window.location.reload(); // Reload page
});

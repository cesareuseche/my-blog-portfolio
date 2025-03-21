---
title: "My Second Article"
date: "16 March 2022"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
image: "/assets/images/second-article.jpeg"
tag: "react"
id: 2
---

This is my first blog post written in Markdown.

```py
"""
For this assignment students will develop a Python program that allows users to input a list of
numbers and calculates three results: the average, the maximum, and the minimum of the
numbers. Write three separate functions:

● calculate_average(numbers): Returns the average of the list.
● find_maximum(numbers): Returns the maximum number.
● find_minimum(numbers): Returns the minimum number.

Each function should take the list of numbers as an argument and return the calculated result.
The main program will call these functions and print the results.

Input:
The user will input a list of numbers separated by commas.
The list will contain at least one number

Proccess:
1. Get the list of numbers from the user
2. Convert the input into a list of numbers
3. Call the three functions and pass the list of numbers as an argument
4. Print the results

Output:
The average, maximum, and minimum of the list of numbers

"""

# I defined the three functions that will calculate the average, maximum, and minimum of the list of numbers
# First I will calculate the average of the list of numbers
def calculate_average(numbers):
  return sum(numbers) / len(numbers)

# Second I will find the maximum number in the list
def find_maximum(numbers):
  return max(numbers)

# Third I will find the minimum number in the list
def find_minimum(numbers):
  return min(numbers)

# I defined the main function that will call the three functions and print the results
def results():
  # I asked the user to input a list of numbers separared by commas
  number_list = str(input("input a list of numbers separated by commas. \n"))

  # I converted the input into a list of numbers by removing the commas,
  # At this point the list is still a string
  list_convertion_to_numbers = number_list.split(",")

  # I looped through the list of numbers and converted each number into a float
  numbers = [float(number.strip()) for number in list_convertion_to_numbers]

  # I called the three functions and passed the list of numbers as an argument
  try:
    print(f"The average of the list of numbers is: {calculate_average(numbers)}")
    print(f"The maximum number in the list is: {find_maximum(numbers)}")
    print(f"The minimum number in the list is: {find_minimum(numbers)}")

  # I handled the ValueError exception in case the user inputs a wrong value
  except ValueError:
    print("Please input a valid number")
    return

results()
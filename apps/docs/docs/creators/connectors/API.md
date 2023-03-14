---
title: API Connector
description: Using Magick agents as a backend API
hide_table_of_contents: false
---

# API Connector

Magick supports dynamic API routes, which means that you can use Magick for some or all of your back end.

As users, we are used to interacting with various websites through their "front end", i.e. the part you actually see. This front end-- what we usually think of as a website-- talks to a "back end" to retrieve data-- basically a secure server somewhere that can get data about users, etc.

Simple websites that don't change (so called "static" sites) can just be a frontend, but the majority of sites we visit have a separate frontend and backend.

The connection between the frontend and backend is called an <strong>API</strong>.

If you'd like to know more about this topic, here is a video that covers it well.
https://www.youtube.com/watch?v=ByGJQzlzxQg

# Usage

The API can be enabled on any running agent. Each agent will have a different API and different token. For example payloads see the REST API properties panel in the agent window.
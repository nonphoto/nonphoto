---
layout: project
title: Public Record
tags:
- code
- web
---

[Public Record](https://public-record.herokuapp.com) is an anonymous real-time collaborative document editor. Each user's changes to the document cause the page to update in real-time for any other user on the page. I worked on this project with [David Moon](https://github.com/dmoon1221) for the final Distributed Systems assignment at Williams College.

Collaborative text editors like these present some interesting design challenges. The user experience needs to be as smooth as possible, so the user's changes are updated in their own document right away, but network latency will cause the document state to diverge if multiple users edit the same part of the document simultaneously.

We solve this problem using a general technique for optimistic concurrency control called Operational Transforms. The basic idea is that each change to the document is represented as an "operation". You could think of the document as a long list of operations on an empty string. Pending operations made in one client are sent to the web server, which forwards them to every other connected client. If changes have been made to the document held by one of the destination clients, a transform function takes the sent operation and the operations that client produced locally, and decides what the resulting text should be.

This is a huge over-simplification of what actually happens, but the details are explained much better in [the paper](https://github.com/nonphoto/public-record/blob/master/writeup/writeup.pdf), which I definitely recommend you take a look at. While there is a lot of writing on the theory of Operational Transformation (notably from Google), we try to explain the design of a real-world implementation while avoiding the obtuseness of most academic research papers.
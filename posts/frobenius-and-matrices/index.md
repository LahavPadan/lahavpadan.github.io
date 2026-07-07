---
layout: post
title: "A map, a matrix, and its quadratic equation"
description: "Why a two-dimensional action gives a quadratic relation, and what the determinant measures."
date: 2026-06-26
tags:
  - cryptography
  - mathematics
entry_type: comprehensive
math: true
---

Whenever a map acts linearly on a two-dimensional space, we can represent that action with a $2\times2$ matrix $M$.

If

$$
M = \begin{pmatrix} a & b \\ c & d \end{pmatrix},
$$

then direct multiplication gives

$$
M^2 - (a+d)M + (ad-bc)I = 0.
$$

This is not merely an identity about symbols. It says that applying the map twice can be rewritten as a combination of applying it once and doing nothing.

That relationship is the bridge from concrete matrix arithmetic to the algebra of endomorphisms.

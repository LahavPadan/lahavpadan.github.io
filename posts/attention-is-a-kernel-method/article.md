
**"Attending-to": Attending Input Vectors to One Another.**
   Calculating the projection coefficients $$<x_i, x_j> = x_i^T x_j$$.
   Attributing the importance to each vector:$$
   \hat{x}_i = <x_1, x_i>x_1 + <x_2, x_i>x_2 + \ldots + <x_n, x_i>x_n
   $$
   Yet, it is preferred to introduce extra flexibility. Instead of using the plain vectors $$z_i$$, we use three matrices $$Q$$, $$K$$, and $$V$$ to transform our $$z_i$$. We get:
   - Query $$q$$
   - Key $$k$$
   - Value $$v$$
   Then, we output the following:$$\hat{x}_i = (q \cdot k_1)v_1 + (q \cdot k_2)v_2 + \ldots + (q \cdot k_n)v_n$$
_**NOTE**_: In matrix notation, we write:
$$
\hat{X} = (Q K^T)V
$$
(We see the similarity between it and PCA: $$XV_k (V_k)^T = (U \Sigma V^T)V_k (V_k)^T$$ . Especially if we ignore $$Q$$, $$K$$, and $$V$$).

This enables us to force the projection coefficients to sum to one (like a probability distribution) using: $$\hat{X} = \text{Softmax}(Q K^T)V$$


###### Connection Between Attention and Kernel Methods
We apply softmax to the attention scores $$a_{ij} = \frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d}}$$, i.e. $$\alpha_{ij} = \text{softmax}(a_{ij}) = \frac{\exp(a_{ij})}{\sum_{j'} \exp(a_{ij'})}$$,
The key relationship to the RBF kernel arises from the form of $$a_{ij}$$ after expanding it using the Euclidean norm identity:

$$
\| \mathbf{q}_i - \mathbf{k}_j \|^2 = \| \mathbf{q}_i \|^2 + \| \mathbf{k}_j \|^2 - 2\mathbf{q}_i^\top \mathbf{k}_j
$$

Rearranging the scaled dot product:

$$
\frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d}} = -\frac{\| \mathbf{q}_i - \mathbf{k}_j \|^2}{2l^2} + \frac{\| \mathbf{q}_i \|^2 + \| \mathbf{k}_j \|^2}{2\sqrt{d}}
$$

Where $$l = \sqrt[4]{d}$$ is a scaling factor for the RBF kernel component. This allows us to express the attention score as:

$$
\exp\left(\frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d}}\right) = \exp\left(-\frac{\| \mathbf{q}_i - \mathbf{k}_j \|^2}{2l^2}\right) \times \exp\left(\frac{\| \mathbf{q}_i \|^2 + \| \mathbf{k}_j \|^2}{2\sqrt{d}}\right)
$$

We are left with:
1. **RBF Kernel Component**: The term $$\exp\left(-\frac{\| \mathbf{q}_i - \mathbf{k}_j \|^2}{2l^2}\right)$$ corresponds to the RBF kernel, which measures similarity based on Euclidean distance.
2. **Magnitude Component**: The term $$\exp\left(\frac{\| \mathbf{q}_i \|^2 + \| \mathbf{k}_j \|^2}{2\sqrt{d}}\right)$$ adjusts the attention score by considering the magnitudes of the query and key vectors.
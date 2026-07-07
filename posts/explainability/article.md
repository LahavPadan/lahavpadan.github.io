
**Key observation: 
Feature Dependence is a problem that will contantly thwart explainability methods.
Each explainability methods will have its problems regarding feature dependence**

#### Feature-dependence in linear regression
Feature-dependence in linear regression is often termed multicollinearity. The OLS (ordinary least squares) solution is:
$$
\hat{\beta} = (X^\top X)^{-1} X^\top y.
$$
Features appear in the columns of $$X$$, making $$X^\top X$$ **singular**.

> [!Info] Reminder - the solutions of normal equations:
>
> Consider the normal equations: $$A^\top A \mathbf{x} = A^\top \mathbf{b}$$
> where $$A \in \mathbb{R}^{N \times M}$$, $$\mathbf{b} \in \mathbb{R}^N$$, and $$\mathbf{x} \in \mathbb{R}^M$$.
>We have:
> 1. A solution $$\mathbf{x}$$ **always exists**.
> 2. The solution $$\mathbf{x}$$ is unique when $$A^\top A$$ is invertible (i.e., when $$N \geq M$$ and $$A$$ has full rank). In this case, the solution is given by: $$\mathbf{x} = (A^\top A)^{-1} A^\top \mathbf{b}$$
> 3. There exist infinitely many solutions $$\mathbf{x}$$ when $$A^\top A$$ is singular.
> 4. Under (3), any two solutions $$\mathbf{x}_1$$ and $$\mathbf{x}_2$$ will differ by a vector in the null space of $$A$$: $$\mathbf{x}_1 - \mathbf{x}_2 \in \mathcal{N}(A)$$

_**Bonus:**_ (4) above is a prime motivator for ridge regularization; even though we will have infinite solutions we take the smallest one, and it doesn't matter since they are all equivilent.

In the case of near-dependence, the eigenvalues of $$X^\top X$$ are very small.
**We detect it by proxy—the variance of the OLS solution $$\hat{\beta}$$:** $$\text{Var}(\hat{\beta}) = \sigma^2 (X^\top X)^{-1}$$
- where $$\sigma^2$$ is the variance of the errors.
Using the spectral decomposition: $$X^\top X = Q \Lambda Q^\top$$. It also holds: $$(X^\top X)^{-1} = Q \Lambda^{-1} Q^\top$$
Thus, $$\text{Var}(\hat{\beta}_j) = \sigma^2 \sum_{i=1}^p \frac{q_{ji}^2}{\lambda_i}$$
If $$\lambda_i$$ is very small, the variance $$\text{Var}(\hat{\beta}_j)$$ becomes large.
**This makes linear regression unstable, since small change in $$\lambda_i$$ yields a significant change in the regression coefficients $$\hat{\beta}_j$$.**


> [!NOTE] Variance Inflation Factor (VIF) and R-Squared
> For each predictor $$X_j$$ in $$\mathbf{X}$$, the variance inflation factor $$VIF_j$$ is defined as: $$VIF_j = \frac{1}{1 - R_j^2}$$
> In a multiple linear regression model, the variance of the $$j$$th coefficient estimate is:
> $$
> \text{Var}(\hat{\beta}_j) = \sigma^2 \cdot \left[(X^\top X)^{-1}\right]_{jj}
> $$
> 
> **We express $$\text{Var}(\hat{\beta}_j)$$ in terms of other features, thereby uncovering the correlation structure.**
> 
> If we regress $$X_j$$ on the other predictors $$X_{-j}$$, we have: $$X_j = \mathbf{X}_{-j} \boldsymbol{\gamma}_j + \mathbf{u}_j$$
> where $$R_j^2$$ is the proportion of variance in $$X_j$$ explained by $$X_{-j}$$.
> Decomposing $$X^\top X$$:
>$$
> X^\top X = \begin{pmatrix}
> X_j^\top X_j & X_j^\top X_{-j} \\
> X_{-j}^\top X_j & X_{-j}^\top X_{-j}
> \end{pmatrix}
> $$
>
> The $$j$$th diagonal element of $$(X^\top X)^{-1}$$ is: $$\left[(X^\top X)^{-1}\right]_{jj} = \frac{1}{X_j^\top M_{-j} X_j}$$
> where $$M_{-j} = I - X_{-j} (X_{-j}^\top X_{-j})^{-1} X_{-j}^\top$$ is the projection matrix.
>
> **Connection to Multicollinearity:**
>The projection matrix $$M_{-j}$$ eliminates the component of $$X_j$$ that is explained by the other predictors, leaving us with the unexplained part, which has variance $$\text{Var}(X_j) \cdot (1 - R_j^2)$$
>
> Thus: $$\left[(X^\top X)^{-1}\right]_{jj} = \frac{1}{\text{Var}(X_j) \cdot (1 - R_j^2)}$$, we get: $$\text{Var}(\hat{\beta}_j) = \text{Var}(X_j) \cdot (1 - R_j^2) \cdot \sigma^2 \cdot \text{(scalar term)}$$ The term $$\frac{1}{1 - R_j^2}$$ quantifies the extent to which the variance of $$\hat{\beta}_j$$ is inflated due to multicollinearity among the predictors. This is exactly the VIF for predictor $$X_j$$:  $$\text{VIF}_j = \frac{1}{1 - R_j^2}$$

****
## Regularization and Feature Dependence


> [!Info] Recall: $$\ell_1$$ Geometric Interpretation
>
> In 2D, 
> The equation $$|\beta_1| + |\beta_2| = t$$ describes a **diamond** shape.
>
> **Vertices:** The vertices of the diamond are at $$(t,0)$$, $$(-t,0)$$, $$(0,t)$$, and $$(0,-t)$$.
>
> - **First Quadrant ($$\beta_1 \geq 0$$ and $$\beta_2 \geq 0$$):**  
>   $$\beta_1 + \beta_2 = t$$  
>   This represents a line segment from $$(t,0)$$ to $$(0,t)$$.
>
> - **Second Quadrant ($$\beta_1 \leq 0$$ and $$\beta_2 \geq 0$$):**  
>   $$-\beta_1 + \beta_2 = t$$  
>   This represents a line segment from $$(-t,0)$$ to $$(0,t)$$.
>
> - **Third Quadrant ($$\beta_1 \leq 0$$ and $$\beta_2 \leq 0$$):**  
>   $$-\beta_1 - \beta_2 = t$$  
>   This represents a line segment from $$(-t,0)$$ to $$(0,-t)$$.
>
> - **Fourth Quadrant ($$\beta_1 \geq 0$$ and $$\beta_2 \leq 0$$):**  
>   $$\beta_1 - \beta_2 = t$$  
>   This represents a line segment from $$(t,0)$$ to $$(0,-t)$$.


**For identical features:**
- $$\ell_1$$ : spreads weight arbitrarily (all weights same sign).
- $$\ell_2$$ : spreads weight evenly. 

| _$$\ell_1$$ Regularizion for identical features._          |  _$$\ell_2$$ Regularizion for identical features._    |
![[identical features - l1 regularization.png|300]]![[identical features - l2 regularization.png|300]]

> [!Proof] Why $$\ell_1$$ Spreads Weight Arbitrarily for Identical Features
>
> The gradient of the loss function $$L(\beta)$$ is given by:
> $$
> \nabla L(\beta) = \left[\frac{\partial L}{\partial \beta_1}, \frac{\partial L}{\partial \beta_2}\right]
> $$
>
> When features are identical, the partial derivatives $$\frac{\partial L}{\partial \beta_1}$$ and $$\frac{\partial L}{\partial \beta_2}$$ are symmetrical and hence equal, so the gradient vector $$\nabla L(\beta)$$ is proportional to $$[1, 1]$$.
>
> The KKT condition for optimality states that:
> $$
> -\nabla L(\beta_1, \beta_2) + \lambda \cdot [\text{sign}(\beta_1), \text{sign}(\beta_2)]^T = 0
> $$
>
> This implies that $$\nabla L(\beta)$$ must point in the opposite direction of $$[\text{sign}(\beta_1), \text{sign}(\beta_2)]$$.
> Therefore, $$[\text{sign}(\beta_1), \text{sign}(\beta_2)]$$ cannot be proportional to $$[1, 0]$$ or $$[0, 1]$$.
>
> Instead, $$[\text{sign}(\beta_1), \text{sign}(\beta_2)]$$ must be proportional to $$[1, 1]$$ (or $$[-1, -1]$$). 
> Therefore, both $$\beta_1$$ and $$\beta_2$$ must be non-zero. 
> Meaning that $$\ell_1$$ spreads weight arbitrarily for identical features.


**For Linearly dependent features:**
- $$\ell_1$$ : chooses variable with larger scale, $$0$$ weight to others.
- $$\ell_2$$ : prefers variables with larger scale – spreads weight proportional to scale.
 
 _$$\ell_1$$ Regularizion for linear dependent features.

![[dependent features - l1 regularization.png|400]]
## WHY CHOOSES LARGERST SCALE

> [!Info] Why $$\ell_1$$ Chooses Variable with Larger Scale and Gives $$0$$ Weight to Others
>
> We have two correlated variables $$x_1$$ and $$x_2$$ such that:
> $$
> x_2 = \rho x_1 + \epsilon
> $$
>
> The gradient of the loss function $$\nabla L(\beta)$$ is approximated as:
> $$
> \begin{bmatrix} \frac{\partial L}{\partial \beta_1} \\ \frac{\partial L}{\partial \beta_2} \end{bmatrix} \approx x_1^T x_1 \begin{bmatrix}
> \beta_1 + \rho \beta_2 \\
> \rho \beta_1 + \rho^2 \beta_2
> \end{bmatrix} - \begin{bmatrix}
> x_1^T y \\
> \rho x_1^T y
> \end{bmatrix}
> $$
>
> This means that the gradient vector $$\nabla L(\beta)$$ aligns closely with $$[1, \rho]^T$$, reflecting the correlation between $$x_1$$ and $$x_2$$.
>
> The KKT condition for optimality states that:
> $$
> -\nabla L(\beta_1, \beta_2) + \lambda \cdot [\text{sign}(\beta_1), \text{sign}(\beta_2)]^T = 0
> $$
> where $$\nabla L(\beta) = \left[\frac{\partial L}{\partial \beta_1}, \frac{\partial L}{\partial \beta_2}\right]$$
>
> Observe that:
> - The gradient vector $$\nabla L(\beta)$$ aligns closely with $$[1, \rho]^T$$.
> - According to KKT conditions, $$\nabla L(\beta)$$ must point in the opposite direction of $$[\text{sign}(\beta_1), \text{sign}(\beta_2)]$$.
> - The definition of $$\text{sign}(\beta_j)$$: 
> $$
> \text{sign}(\beta_j) = \begin{cases} 
> +1 & \text{if } \beta_j > 0, \\
> -1 & \text{if } \beta_j < 0, \\
> \text{any value in } [-1, 1] & \text{if } \beta_j = 0.
> \end{cases}
> $$
>
> Since $$\rho \neq  1$$, at least one of $$\beta_1$$ or $$\beta_2$$ must be zero.


# ELASTIC NET REGULARIZATION

# Feature-Importance
There are two types of feature importance: 
1. **Global Interpretation.**
	   Feature importance score general to the model, for all predictions. These importances are found from the training set, _offline_, before any test-predictions are done. Their role is to:  
	- **Feature Engineering:** Reflects back to the model engineer, the extent in which extracted features infulenced the model.
		**How?** check magnitude of importances given to extracted features.
	
	- **Detect Information Leakage:** Identify if any feature incorrectly uses information from the target labels.
	    **How?** these features will show up as unusually high importance.
	
	- **Uncover Unwanted Feature Dependencies:** Detecting dependencies that you don’t want. 
	    **How?** in Permutation-Feature-Importance (PFI) for instance, we expect a significant decrease in accuracy due the permutation breaking correlation structures, thereby generating out-of-distribution examples; on which the model is expected to perform poorly. 

 2. **Local Interpretation.**
    This type of feature importance focuses on individual predictions. These importances are computed _online_, meaning the model is evaluated multiple times on different examples to understand the contribution of each feature to the prediction to be explained.
    Their role is to:  
    
    - **Evaluate Prediction Trustworthiness:** For a given prediction, the "Explanation" shows which features most influenced the decision. If these feature contributions align with human intuition, it helps determine whether the prediction can be trusted.
        **How?** check if the feature importances align with human intuition for the specific prediction being explained.


## Global Interpretation

Linear models and tree models already have a measure for feature importance: 
- **Linear models:** $$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p + \epsilon$$ - the _absolute value_ of the coefficient associated with feature $$j$$. 
- **Tree Models:** the reduction in gain, obtained when splitting on feature $$j$$.
	(If feature $$j$$ is used in multiple splits within a single tree, we sum the gains from each of those splits.)  
	(In random-forest or gradient-boosing, the final feature importance is found by averaging feature-importances from indivdual trees).
#### Feature-Importance by _Randomizing others_ 
##### Permutation-Feature-Importance (PFI)
To predict the $$j$$-th feature importance, 
1. **Perturbtion**:  
   we permute $$j$$-th feature's value across the training examples. Specifically, we replace the original $$j$$-th feature value $$x_{ij}$$ with a randomly chosen value $$\tilde{x}_{ij}$$ from the $$j$$-th feature values of other samples in the dataset.
2. **Evaluation**: 
   The performance on the original dataset is: $$P_{\text{baseline}} = \frac{1}{n} \sum_{i=1}^n \mathcal{L}(f(x_i), y_i)$$
   After permuting feature $$x_j$$, again, we compute an average $$P_{\text{perm}}(x_j)$$.
   The PFI score is: $$\text{PFI}(x_j) = P_{\text{baseline}} - P_{\text{perm}}(x_j)$$ .

   If the model's performance deteriorates significantly after this shuffling, it implies that the $$j$$-th feature was important for the model's predictions.

   By randomly shuffling the $$j$$-th feature's values, we break any potential relationship it has with the target $$y$$. 

**Disadvantages of Permutation-Feature-Importance:** 
- **Perturbed examples might be misleading:** by permutating, we are potentially evaluating _out-of-distribution_ examples, whose model predictions are not meaningful. 
- **Assumes independent features**: Moreover, if some features are dependent, permutation breaks this structure, resulting in out-of-distribution examples.


#### Feature-Importance by _Marginizing others (Taking Expectations)_

##### Partial-Dependence-Plot
- Let $$x_{i\mid i\neq j}$$ be all features apart from $$x_j$$  
To predict the $$j$$-th feature importance, 
1. **Perturbation:** Fix $$x_j$$ and average over all possible values of $$x_{i \mid i \neq j}$$, the resulting function $$f_j(x_j)$$ captures the "average" behavior of the model as $$x_j$$ changes: $$ f_j(x_j) = \mathbb{E}_{x_{i\mid i\neq j}} [f(\mathbf{x})] = \int p(\mathbf{x}_{i\mid i\neq j}) f(\mathbf{x})  \, d\mathbf{\mathbf{x}_{i\mid i\neq j}}$$
2. **Evaluation:** If $$f_j(x_j)$$ changes significantly as $$x_j$$ changes, it implies that $$x_j$$ has a strong influence on the model's predictions. To quantify the importance of the $$j$$-th feature using $$f_j(x_j)$$, we could measure:
	- **Range:** $$\max\{f_j(x_j)\} - \min\{f_j(x_j)\}$$. A large range indicates that the feature has a significant impact on the predictions. 
	- **Variance:** The variance of $$f_j(x_j)$$ over the distribution of $$x_j$$.  

**Disadvantages of Partial-Dependence-Plot:** 
- if the GAM assumption does not hold (see below), i.e. cross terms exist (meaning, features are dependent). Due to the averaging, some linear dependencies might not be revealed. 
Example:   
    $$Y$$ is a function of $$x_1$$, $$x_2$$, $$x_3$$.
     A linear dependence term in $$x_2$$ will, however, not be revealed as part of $$f_2(x_x)$$.
     $$Y = 0.2X_1 - 5X_2 + 10X_2 \mathbf{1}[X_3 > 0] + \epsilon$$, 
     with $$\epsilon \sim N(0, 1)$$ and $$X_1, X_2, X_3 \sim \text{Unif}(-1, 1)$$.
$$
f_2(x_2) = \mathbb{E}_{X_1, X_3}\left[f(x_2, X_1, X_3)\right] = 0.2\mathbb{E}[X_1] - 5x_2 + 10x_2 \mathbb{P}(X_3 > 0).
$$
	Since $$\mathbb{E}[X_1] = 0$$ and $$X_3$$ is uniformly distributed, $$\mathbb{P}(X_3 > 0) = \frac{1}{2}$$. 
	We get: $$f_2(x_2) = 0 - 5x_2 + 10x_2 \times \frac{1}{2} = 0$$ .

> [!Info] Partial Dependence captures the additive effect of GAM
>
> GAM (Generalized Additive Models) assumes that a prediction $$\hat{y}$$ can be decomposed as: $$\hat{y} = \beta_0 + \sum_{i=1}^{N} g_i(x_i)$$
> - where $$\sum_{i=1}^{p} g_i(x_i)$$ represents the additive contribution of each feature.
>
> **Partial Dependence captures this additive effect**, 
> Assume that $$f(x) = \beta_0 + \sum_{i=1}^{N} g_i(x_i)$$, then:
> $$\begin{aligned}
> f_j(x_j) &= \mathbb{E}_{\mathbf{x}_{i \mid i \neq j}}\left[\beta_0 + \sum_{i=1}^{N} g_i(x_i)\right] \\
>          &= \mathbb{E}_{\mathbf{x}_{i \mid i \neq j}}\left[\beta_0 + g_j(x_j) + \sum_{\mathbf{x}_{i \mid i \neq j}} g_i(x_i)\right] \\
>          &= g_j(x_j) + \left(\beta_0 + \mathbb{E}_{\mathbf{x}_{i \mid i \neq j}}\left[\sum_{\mathbf{x}_{i \mid i \neq j}} g_i(x_i)\right] \right)
> \end{aligned}$$
> - $$\left(\beta_0 + \mathbb{E}_{\mathbf{x}_{i \mid i \neq j}}\left[\sum_{\mathbf{x}_{i \mid i \neq j}} g_i(x_i)\right] \right)$$ is constant with respect to $$x_j$$, and hence does not affect the variation of $$f_j(x_j)$$ due to $$x_j$$ (whether by range or variance).
>   
> Therefore, Partial-Dependence-Plot isolates the additive contribution of each feature, assuming the model can be decomposed as $$\hat{y} = \beta_0 + \sum_{i=1}^{N} g_i(x_i)$$ .
>
> **_NOTE:_** GA$$^2$$M (Generalized Additive Models with Pairwise Interactions) assumes that a prediction $$\hat{y}$$ can be decomposed as: $$\hat{y} = \beta_0 + \sum_{j=1}^{p} g_j(x_j) + \sum_{i < j} g_{ij}(x_i, x_j)$$. 
> Meaning that it introduces an extra term - $$\sum_{i < j} g_{ij}(x_i, x_j)$$, which captures the pairwise interactions.

# CONDITIONAL EXPECTATION


#### Leave-One-Covariate-Out (LOCO)
_Most accurate, yet expensive of them all is Leave-One-Covariate-Out (LOCO)._
It is perhaps the most natural and intuitive yet.  

**Prepration:** 
1. Evaluate the model on all the features. 
2. Record the loss $$e_{original}$$ after fitting the model (training loss).

**Evaluating Features:**
For each feature $$j$$, fit the model without feature $$j$$ in the training examples. 
	Record the loss $$e_j$$ after fitting the model (training loss).

**Assigning Scores:**
For each feature $$j$$, evaluate the increase in loss $$e_j - e_{original}$$,

The importance of each feature is assessed based on the increase in loss, with higher increases indicating greater importance.



## Local Interpretation

### Baseline and "feature missingness"
Local Interpretation methods relay on _online_ evaluations of the model. 
However, on the presence of only the instance whos' prediction should be explained; we have nothing to compare against. 
As a result, we need a baseline, to compare against.
In a notion of feature missingness it also manifests itself as a default value.

> [!Info] Baselines 
>
> #### Image Data
> - **Zero Baseline (Black Image):**
>   - **Practicality:** Common in CNNs (e.g., ResNet, VGG). Provides clear attribution for features contributing to predictions.
>   - **Mathematical Rigor:** Importance of pixel $$p$$ is $$I_p - 0$$, where $$0$$ is the baseline pixel value.
>
> - **Mean Image Baseline:**
>   - **Practicality:** Used in healthcare models (e.g., chest X-rays). Shows deviation from average case.
>   - **Mathematical Rigor:** Mean baseline $$I_{\text{mean}} = \frac{1}{|D|} \sum_{i=1}^{|D|} I_i$$. The difference $$f(I) - f(I_{\text{mean}})$$ highlights feature deviations.
>
> - **Blurred Image Baseline:**
>   - **Practicality:** Applied in autonomous driving. Highlights critical high-resolution features.
>   - **Mathematical Rigor:** Blurred image $$I_{\text{blur}} = G_\sigma * I$$, using Gaussian filter $$G_\sigma$$.
>
> #### Text Data
> - **Padding (e.g., "[PAD]"):**
>   - **Practicality:** Used in NLP (e.g., BERT, GPT) for fixed input lengths.
>   - **Mathematical Rigor:** For sequence $$S$$ with length $$L$$, padding to $$S_{\text{pad}}$$ where $$|S_{\text{pad}}| = L_{\text{max}}$$. Contribution of tokens is computed against padded tokens.
>
> - **Empty Text Baseline:**
>   - **Practicality:** Used in sentiment analysis (e.g., product reviews). Isolates impact of specific words.
>   - **Mathematical Rigor:** Importance of word $$w$$ is $$f(w) - f(\text{" "})$$.
>
> - **Neutral Text Baseline:**
>   - **Practicality:** Used in finance (e.g., market news). Serves as a stable reference point.
>   - **Mathematical Rigor:** Importance of word $$w$$ is $$f(w) - f(w_{\text{neutral}})$$.
>
> #### Tabular Data
> - **Typical Feature Imputations:** Mean Imputation, Median Imputation, Historical Imputation, etc.
> - **Conditional Expectation Baseline:**
>   - **Practicality:** Used in models with interdependent features (e.g., insurance pricing, personalized medicine).
>   - **Mathematical Rigor:** Baseline is $$\mathbb{E}[x_i | X_{-i}]$$, considering dependencies among features. Example: In credit scoring, the expected loan amount given high income as a baseline.


### Feature dependence and lime
### Lime 
**Local Interpretable Model-agnostic Explanations**
In LIME, we approximate the model $$f(\mathbf{x})$$ near the instance $$\mathbf{x_0}$$ by evaluating $$f$$ on perturbed instances $$\mathbf{x}′$$ and using these evaluations to train a simpler linear explanation model $$g(\mathbf{x}′)$$. 

- $$S$$ is a set over $$\{0, 1\}^N$$, where $$S[i] = 0$$ indicates masking the $$i$$-th feature; i.e. replacing it by some default value. If $$S[i] = 1$$ then the $$i$$-th in $$x_0$$ stays as it is.
- $$x_S'$$ is pertubation of $$x_0$$ according to the $$S[i]$$ in $$S$$. 
  
**Optimization Problem:** 
$$\begin{align*}
\min_{\mathbf{w}=(w_1, \ldots, w_N)} & \; \frac{1}{2^N}\cdot\sum_{S \in \{0, 1\}^N} \left[\pi_{x_0}(x_S') \cdot (w_S^Tx_S' - f(x_S'))^2 \right] 
\end{align*}$$
- where $$\pi_{x_0}(x_S')$$ is a function that penalizes $$x'_S$$ s that are far away from $$x_0$$. 
  The RBF kernel is most commonly used: $$\pi_{x_0}(x_S') = \exp\left(-\frac{\|x_0 - x_S'\|^2}{\sigma^2}\right).$$

**Lime Feature Importances** - the weight $$w_i$$ corresponding to feature $$i$$, represents its importance for the prediction of $$x_0$$.


**The proximity weighting $$\pi_x(x')$$ encourages a local linear approximation of $$f(x)$$.**
In the Taylor expansion of $$f(x)$$ around $$x_0$$, higher-order terms are of the order $$\mathcal{O}(\|x' - x\|^2)$$ or higher, which become significant when $$\|x' - x\|$$ is large. In contrast, the proximity weighting reduces the impact of these higher-order terms by assigning lower weights to more distant points, thereby emphasizing the linear terms closer to $$x_0$$.

_**NOTE:**_ $$\sigma$$ is a hyperparameter:
- **Small $$\sigma$$**: Emphasizes instances very close to $$x$$, leading to a highly local approximation.
- **Large $$\sigma$$**: Allows the approximation to consider a wider neighborhood around $$x$$, potentially capturing more global trends but at the cost of accuracy.


**In practice, solving LIME is done using a Monte Carlo simulation.
This way, we solve the optimization problem on an exponential number of sets $$S \in \{0, 1\}^N$$.**
1. Sample $$S_1, S_2, \ldots, S_M$$ from the space $$\{0, 1\}^N$$.
2. The new objective is:
$$\hat{L}(\mathbf{w}) = \frac{1}{M} \sum_{i=1}^M \pi_{x_0}(x_{S_i}') \cdot \left( \mathbf{w}^T x_{S_i}' - f(x_{S_i}') \right)^2$$

> [!NOTE] LIME - Solving for $$w$$
>
> Expanding the quadratic term, we have: $$L(\mathbf{w}) = \frac{1}{2^N} \sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot \left(\mathbf{w}^T x_S' x_S'^T \mathbf{w} - 2f(x_S') \mathbf{w}^T x_S' + f(x_S')^2 \right)$$
> The gradient of $$L(\mathbf{w})$$ with respect to $$\mathbf{w}$$ is: $$\nabla_{\mathbf{w}} L(\mathbf{w}) = \frac{2}{2^N} \sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot \left(2 x_S' x_S'^T \mathbf{w} - 2 f(x_S') x_S' \right)$$
> Setting $$\nabla_{\mathbf{w}} L(\mathbf{w}) = 0$$, we obtain the normal equation:
> $$\sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot x_S' x_S'^T \mathbf{w} = \sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot f(x_S') x_S'$$
> This can be rewritten in matrix form as: $$\mathbf{A} \mathbf{w} = \mathbf{b}$$
> where:
> $$\mathbf{A} = \sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot x_S' x_S'^T,$$
> and
> $$\mathbf{b} = \sum_{S \in \{0, 1\}^N} \pi_{x_0}(x_S') \cdot f(x_S') x_S'.$$



### Feature Importance using the coalition game 
The model made a prediction, we would like to distribute the total cost across the factors (features) that attributed it. 
 
**Example**
A model that predicts house prices based on `location`, `rooms` and `condition`.
- Suppose a prediction of \$386,000 for a house with:
   `Location: Prime (1)`, `rooms: 4` , `condition: 0.8` 
Our shap model: 
- **Baseline (all features at 0)**: \$200,000 .
- **Location**: `Prime (1)` location increases price by \$50,000.
- **Rooms**: `rooms: 4` adds \$120,000 .
- **Condition**: `condition: 0.8` adds \$16,000 .

_**NOTE:**_ This means that the feature importance is sensitive to scale (of inputs).
In a linear model for example $$f(\lambda x) = \lambda f(x)$$, and then, we will have to distribute a total of $$\lambda f(x)$$ amongst the features. 


### The Coalition Game 

- $$N$$ is the number of features. 
- $$w_{S}(x) = \sum_{j \in S} \phi_{\text{j}}(x)$$
- $$q_{|S|}$$ is a weighting that depends only on $$|S|$$.

**Optimization Problem:** $$\begin{align*}
\min_{\phi_1(x), \ldots, \phi_N(x)} & \sum_{S \subseteq N} \left[ w_S(x) - f_{S}(x) \right]^2 q_{|S|} \\
\text{subject to} \quad & w_{\{1, \ldots, N\}}(x) = \sum_{j=1}^N \phi_j(x) = f_{\{1, \ldots, N\}}(x) - f_\emptyset(x)
\end{align*}$$
- This is weighted least-squares.

**The general solution is:** (proof ahead)
$$
\phi_{\text{j}}(x) = \frac{f_{\{1, \ldots , N\}}(x) - f_\emptyset(x)}{N} + \frac{1}{\beta} \sum_{S \subseteq [N] : i \in S} \left(\frac{N-|S|}{N} q_{|S|}f_S(x) - \frac{|S \setminus \{i\}|}{N} q_{|S \setminus \{i\}|}f_{S \setminus \{i\}}(x) \right),
$$
- where $$\beta = \sum_{s=1}^{N-1} q_s\binom{N-2}{s-1}$$, provided $$\beta \neq 0$$.
## minor problem with s=0 and s=N-1

> [!Info] Feature Dependency Sensitivity in SHAP
>
> SHAP values are sensitive to feature dependencies. For instance, if $$x_3 = x_1 + x_2$$, SHAP can distribute importances among $$\{x_1, x_2, x_3\}$$ in various ways, potentially assigning zero importance to one feature while allocating the total importance between the others.
>
> **Ubiquity of Feature Dependencies:**  
> Feature dependencies are inherent in most real-world scenarios. For example, in house price models, features like `location`, `rooms`, and `condition` are naturally correlated, leading to inherent ambiguity in feature importance.
>
> **Addressing Ambiguity:**  
> To resolve this ambiguity, we take several approaches:
> - Break the ambiguity by introducing conventions, such as ordering of the features.
> - We can orthogonalize the features before applying SHAP. However, transparency is crucial because the orthogonalized features may show reduced importance compared to the original features.

### The SHAP methods: 
The landscape of shap methods and their assumptions goes as follows:

- **Shapley values** (game-theoretic version) require training the model with $$S$$ features at a time; which is prohibitive. 
  Not only we will have to train a model $$\hat{f}_S$$,  $$2^N$$ times, we will have to evaluate $$\hat{f}_S(x)$$ on the predication to be explained.
  
In practice evaluting the model $$2^N$$ times is solved by a monte-carlo method on the sets $$S$$. (explained ahead). 
So, only the problem of finding the models $$\hat{f}_S$$ remains.

- **Shap values** (according to Lundberg-Lee 2017) aim to solve this problem, by approximating the model $$\hat{f}_S$$, trained on a partial set of features, via conditional expectation on the original $$f(\mathbf{x})$$; expectation which is given on values for the missing features. 
  Mathematically: $$
\bar{f}_S(x) = \mathbb{E}_{p(x_1, \ldots, x_{N-|S|} \mid \mathbf{x}_S)} \left[f(\mathbf{x}) \mid \mathbf{x}_{\bar S} = (x_1, \ldots, x_{N-|S|}) \right]
$$This introduces a new problem - estimating $$p(x_1, \ldots, x_{N-|S|} \mid \mathbf{x}_S)$$ - the conditional probability on the **missing** features ($$\mathbf{x_{\bar S}}$$) **given the non-missing** features ($$\mathbf{x_S}$$). 
	Due to this, we can take another (**unrecommended**) approximation - 
	replacing the expectation on evaluations of $$f$$: $$(\bar{f}_S(x) = \mathbb{E}_{p(x_1, \ldots, x_{N-|S|} \mid \mathbf{x}_S)} \left[f(\mathbf{x}) \mid \mathbf{x}_{\bar S} = (x_1, \ldots, x_{N-|S|}) \right])$$) 
	by evaluating $$f$$ _once_ on the _expected input_ -  $$f(\mathbf{x}_S, \mathbb{E}_{\mathbf{p(x_{\bar{S}}})}[\mathbf{x}_{\bar S}])$$.

_**NOTE**_: This version is being referenced as SHapley Additive exPlanations (=SHAP).

- **Kernel-Shap** Replaces the conditional distribution $$p(x_1, \ldots, x_{N-|S|} \mid \mathbf{x}_S)$$ by $$p(x_1, \ldots, x_{N-|S|}) = p(x_{\bar{S}})$$. However, there is an assumption of independence among missing features, which leads to the use of the product of marginal distributions: $$p(\mathbf{x}_{\bar{S}}) = \prod_{i \in \bar{S}} p(x_i)$$.
  Mathematically: $$\bar{f}_S(x) = \mathbb{E}_{\mathbf{p(x_{\bar{S}}})} \left[f(\mathbf{x}) \mid \mathbf{x}_{\bar S} = (x_1, \ldots, x_{N-|S|}) \right]$$

### Monte-Carlo approach for Subset Sampling

The expectation is approximated by sampling: $$\bar{f}_S(x) \approx \frac{1}{M} \sum_{m=1}^{M} f(\mathbf{x}_S, \mathbf{x}_{\bar{S}}^{(m)})$$ Here:
	where $$\mathbf{x}_{\bar{S}}^{(m)}$$ is a sample drawn from the marginal distribution $$p(\mathbf{x}_{\bar{S}})$$.
	and $$M$$ is the number of samples.

- Rather than sampling from $$p(S)$$ directly, it’s easier to first sample the size of $$S$$, and then sample uniformly from subsets of the selected size.
  
- Kernel Shap samples each $$x_i^{(m)} \in \mathbf{x}_{\bar{S}}^{(m)}$$ from the marginal: $$p(x_i)$$ (as kernel shap assumes independence).

- From the code for Kernel Shap (December 8, 2021), 
  it seems that they have a budget (which can be user-provided) for the number of subsets they’re going to sum over.
  1. They start with subsets of size $$1$$ and $$N-1$$, and see if they can fit all of those subsets into their budget. If so, they sum over all those subsets explicitly.
  2. Next, they check if they can also include all subsets of size $$2$$ and $$N-2$$ within the remaining budget. If so, they add those in. 
  3. They continue until they get to an $$i$$ for which they cannot fit all the subsets of size $$i$$ and $$N-i$$ within the remaining budget. At this point, they switch to random sampling from remaining subsets with the remaining budget.


### Deriving the General Solution for the Coalition Game
Note: $$w_{\{1, \ldots, N\}}(x)$$ is $$w_N(x)$$.

> [!NOTE] Solving the Coalition Game Optimization Using the Lagrangian
> 
> The Lagrangian is 
> $$
> L(w_{S}(x), \lambda) = \sum_{S \subseteq N} \left(w_{S}(x) - f_{S}(x)\right)^2 q_{|S|} - \lambda \left( w_{N}(x) - f_{N}(x) + f_\emptyset(x) \right)
> $$
> 
> 1. By setting $$\frac{\partial}{\partial w_{S}(x)} L(w_{S}(x), \lambda) = 0$$, we have 
> $$
> \frac{1}{2} \lambda = \sum_{S \subseteq N : j \in S} \left(w_{S}(x) - f_{S}(x)\right) q_{|S|}
> $$
> 
> 2. Summing this over $$j$$ and dividing by $$n$$, we get 
> $$
> \frac{1}{2} \lambda = \frac{1}{n} \sum_{j} \sum_{S : j \in S} \left(w_{S}(x) q_{|S|} - f_{S}(x) q_{|S|}\right)
> $$
> 
> 3. We examine the two terms on the right-hand side. Counting the terms involving $$w_{j}(x)$$ and $$w_{k}(x)$$ for $$k \neq j$$, and using $$w_{N}(x) = f_{N}(x) - f_\emptyset(x)$$, we have: 
> $$
> \sum_{S \subseteq N : j \in S} w_{S}(x) q_{|S|} = \sum_{s=1}^{N} \binom{N-1}{s-1} q_{|S|} w_{j}(x) + \sum_{k \neq j} \sum_{s=2}^{N} \binom{N-2}{s-2} q_{|S|} w_{k}(x)
> $$
> $$
> = q_{1} w_{j}(x) + \sum_{s=2}^{N} q_{|S|} \left(\binom{N-1}{s-1} w_{j}(x) + \sum_{k \neq j} \binom{N-2}{s-2} w_{k}(x) \right)
> $$
> $$
> = q_{1} w_{j}(x) + \sum_{s=2}^{N} \left(\binom{N-2}{s-1} w_{j}(x) + \binom{N-2}{s-2} \left(f_{N}(x) - f_\emptyset(x)\right)\right) q_{|S|}
> $$
> $$
> = \sum_{s=1}^{N-1} \binom{N-2}{s-1} q_{|S|} w_{j}(x) + \sum_{s=2}^{N} \binom{N-2}{s-2} q_{|S|} \left(f_{N}(x) - f_\emptyset(x)\right)
> $$
> 
> 4. Summing over $$j$$, we obtain: 
> $$
> \sum_{j} \sum_{S : j \in S} w_{S}(x) q_{|S|} = \sum_{s=1}^{N-1} \binom{N-2}{s-1} q_{|S|} \left(f_{N}(x) - f_\emptyset(x)\right) + \sum_{s=2}^{N} N \binom{N-2}{s-2} q_{|S|} \left(f_{N}(x) - f_\emptyset(x)\right)
> $$
> $$
> = N \sum_{s=1}^{s} \binom{N-1}{s-1} q_{|S|} \left(f_{N}(x) - f_\emptyset(x)\right)
> $$
> For the second term, we have $$\sum_{j} \sum_{S : j \in S} f_{S}(x) q_{|S|} = \sum_{S \subseteq N} |S| f_{S}(x) q_{|S|}$$.
> 
> 5. Plugging the results into the earlier equation gives 
> $$
> \frac{1}{2} \lambda = \frac{1}{n} \left(N \sum_{s=1}^{s} \binom{N-1}{s-1} q_{|S|} \left(f_{N}(x) - f_\emptyset(x)\right) - \sum_{S \subseteq N} |S| q_{|S|} f_{S}(x)\right)
> $$
> 
> 6. Finally, solving for $$w_{j}(x)$$: 
> $$
> w_{j}(x) = \frac{1}{n} \left(f_{N}(x) - f_\emptyset(x)\right) + \left(\sum_{s=1}^{N-1} \binom{N-2}{s-1} q_{|S|}\right)^{-1} \left(\sum_{S : j \in S} q_{|S|} f_{S}(x) - \frac{1}{n} \sum_{S \subseteq N} |S| q_{|S|} f_{S}(x)\right)
> $$
> 
> By splitting all subsets of $$N$$ into ones that contain $$j$$ and ones that do not, and pairing them up, we have:
> 
> $$
> \sum_{S \subseteq N} |S| q_{|S|} f_{S}(x) = \sum_{S : j \in S} \left(|S| q_{|S|} f_{S}(x) + (|S| - 1) q_{|S|-1} f_{S - j}(x)\right)
> $$
> 
> Plugging this back in, we get the desired result. □


### Shapley-values

In shapley-values, we have: $$q_s = \frac{1}{N} \cdot \binom{N-2}{s-1}^{-1}$$
	**Technical Notes about undefined $$q_s$$**:
	Recall, the optimization $$\min_{\phi_1(x), \ldots, \phi_N(x)} \sum_{S \subseteq N} \left[ w_S(x) - f_{S}(x) \right]^2 q_{|S|}$$ 
	When $$S=\emptyset$$, $$q_s$$ is undefined due to the inclusion of $$|S|$$ in the denominator.
	This forces: $$f(S) = f(\emptyset) = \phi_0$$ in the optimization.

The Shapley values are:
$$\phi_j(x) = \sum_{S \subseteq [N] \setminus \{i\}} \frac{|S|! \cdot (N - |S| - 1)!}{N!} \left[f_{S \cup \{i\}}(x) - f_S(x)\right]$$
- Rewriting, $$p_S = \frac{|S|! \cdot (N - |S| - 1)!}{N!} = \frac{1}{N}\binom{N-1}{|S|}^{-1}$$ is the uniform distribution of sets!
  Therefore, $$\phi_j(x) = E_{S: i \in S}[f_{S \cup \{i\}}(x) - f_S(x)]$$

> [!info] Deriving Shapley Values from the General Solution
> **We plug $$q_s = \frac{1}{N} \cdot \binom{N-2}{s-1}^{-1}$$ into the solution.**
> - Calculating $$\beta = \sum_{s=1}^{n-1} q_s\binom{N-2}{s-1}$$
> $$
> \beta = \frac{1}{N-1} \sum_{s=1}^{N-1} \frac{N}{s} \cdot \binom{s-1}{N-2}^{-1} \cdot \binom{s-1}{N-2} = \frac{N-1}{N} :
> $$
> 
**Shapley Value Expression:**
> - Combinatorial Identities:
> 	1. $$\binom{N-1}{|S|} = \frac{N - |S|}{N} \binom{N-2}{|S|-1}$$
> 	2. $$\binom{N-1}{|S|-1} = \frac{|S|}{N} \binom{N-2}{|S|-2}$$
>
> $$
> \phi_j(x) = \frac{1}{N} \left[ f_{\{1, \dots, N\}}(x) - f_\emptyset(x) \right] + \frac{N-1}{N} \sum_{S \subseteq [N]: j \in S} \left( \frac{N - |S|}{N^2} \cdot \binom{N-2}{|S|-1}^{-1} f_S(x) - \frac{|S \setminus \{j\}|}{N^2} \cdot \binom{N-2}{|S|-2}^{-1} f_{S \setminus \{j\}}(x) \right)
> $$
> 
> **Rewriting with Sets:**
> We note that each set $$T$$ appears once as $$f_S(x)$$ and once as $$f_{S \setminus \{j\}}(x)$$. 
> Since $$T$$ is of the same size in both cases, the coefficient preceding it is the same. Thus:
> $$
> \phi_j(x) = \sum_{T \subseteq [N] \setminus \{j\}} \frac{N!}{|T|! \cdot (N - |T| - 1)!} \left[ f_{T \cup \{j\}}(x) - f_T(x) \right]
> $$

$$\phi_j(x) = \sum_{S \subseteq [N] \setminus \{i\}} \frac{|S|! \cdot (N - |S| - 1)!}{N!} \left[f_{S \cup \{i\}}(x) - f_S(x)\right]$$

_It turns out that by requiring some axioms on $$\phi_j(x)$$, 
their solution will be **unique** - the one and only shapley-values!_
The first axiom (efficiency) will be our optimization constraint on $$\phi_j(x)$$. 
The rest (symmetry, monotonicity), will be conditioned on $$f(x)$$!
**Axioms:** 
1. **Efficiency:** $$w_{\{1, \ldots, N\}}(x) = \sum_{j=1}^N \phi_j(x) = f_{\{1, \ldots, N\}}(x) - f_\emptyset(x)$$
2. **Symmetry:** If $$f_{S \cup \{i\}}(x) = f_{S \cup \{j\}}(x)$$ for all subsets $$S \subseteq N \setminus \{i, j\}$$, then $$\phi_i(x) = \phi_j(x)$$.
3. **Monotonicity:** If $$f_{S \cup \{i\}}(x) - f_{S}(x) \geq f_{S \cup \{j\}}(x) - f_S(x)$$ for all $$S \subseteq N \setminus \{i, j\}$$, then $$\phi_i(v) \geq \phi_j(v)$$.

Combining all three axioms—Symmetry, Efficiency, and Monotonicity
constrains the function $$\phi_i(v)$$ to be the shapley-values: $$\phi_j(x) = \sum_{S \subseteq [N] \setminus \{i\}} \frac{|S|! \cdot (N - |S| - 1)!}{N!} \left[f_{S \cup \{i\}}(x) - f_S(x)\right]$$
Lets check:
1. It sums contributions to the total value (Efficiency).
2. It averages contributions across symmetric features (Symmetry).
3. It respects the ordering of marginal contributions ($$f_{S \cup \{i\}}(x) - f_S(x)$$) (Monotonicity).

_The last two can be easily verified for shapley-values. The first (efficiency), however, is less clear._

> [!NOTE] Shapley values satisfies Efficiency axiom
> We will analyze appearance of terms across the entire sum. 
> - For each set $$S$$, such that $$|S| = k \ (<N)$$:
>     1. Appears $$N - |S|$$ times _positively_ as $$f_{S \cup \{i\}}(x)$$ (for each $$i \in N \setminus S$$), with coefficient $$p_{S:|S|=k-1} = \frac{(k-1)! \cdot (N - k)!}{N!}$$.
>     2. Appears $$|S|$$ times _negatively_ as $$f_S(x)$$ (for each member in $$S$$), with coefficient $$p_{S:|S|=k} = \frac{k! \cdot (N - k-1)!}{N!}$$.
>     3. Overall, $$S$$ appears $$\binom{N}{k}^{-1}$$ times with a positive sign, and $$\binom{N}{k}^{-1}$$ times with a negative sign.
> - $$f_{\{1, \ldots, N\}}(x)$$ appears once for every $$i \in {\{1, \ldots, N\}}$$ as $$f_{S \cup \{i\}}(x)$$. 
>   Each time the coefficient is $$p_{S:|S|=N-1} = \frac{(N-1)! \cdot (N - N)!}{N!} = \frac{1}{N}$$, summing to 1.
>   (The same is true for $$f_\emptyset(x)$$, albeit with a negative sign).

_We can show this more rigoursly. We show that the Lagrangian $$\mathcal{L}$$ is strictly convex, meaning the minimization of $$\mathcal{L}$$ is unique._
> [!info] Solution uniqueness using the Lagrangian's strict convexity
> 
> **Lagrangian Function**
> $$\mathcal{L}(\phi_1(x), \dots, \phi_N(x), \lambda) = \sum_{S \subseteq N} \sum_{j \in S} \frac{\left( \phi_j(x) - f_S(x) \right)^2}{q_{|S|}} + \lambda \left( \sum_{j=1}^N \phi_j(x) - \left[f_{\{1, \ldots, N\}}(x) - f_\emptyset(x)\right] \right)$$
> 
> 1. **Compute the First Derivatives**
> 
> - With respect to $$\phi_j(x)$$:
> $$
> \frac{\partial \mathcal{L}}{\partial \phi_j(x)} = 2 \sum_{S \subseteq N: j \in S} \left( \sum_{k \in S} \phi_k(x) - f_S(x) \right) q_{|S|} + \lambda
> $$
> 
> - With respect to $$\lambda$$:
> $$
> \frac{\partial \mathcal{L}}{\partial \lambda} = \sum_{j=1}^N \phi_j(x) - \left[f_{\{1, \ldots , N\}}(x) - f_\emptyset(x)\right]
> $$
> 
> 2. **Compute the Hessian**
> 
> - Hessian with respect to $$\phi_i(x)$$ and $$\phi_j(x)$$:
> $$
> H_{ij} = \frac{\partial^2 \mathcal{L}}{\partial \phi_i(x) \partial \phi_j(x)} = 2 \sum_{S \subseteq N: i, j \in S} q_{|S|}
> $$
> 
> - Mixed partial derivatives with respect to $$\lambda$$:
> $$
> \frac{\partial^2 \mathcal{L}}{\partial \phi_j(x) \partial \lambda} = 1
> $$
> 
> - Second derivative with respect to $$\lambda$$:
> $$
> \frac{\partial^2 \mathcal{L}}{\partial \lambda^2} = 0
> $$
> 
> 3. **Form the Hessian Matrix**
> 
> The Hessian matrix $$\mathcal{H}_{\mathcal{L}}$$ is an $$(N+1) \times (N+1)$$ matrix:
> $$
> \mathcal{H}_{\mathcal{L}} = \begin{bmatrix}
> H_{\phi \phi} & \mathbf{1} \\
> \mathbf{1}^\top & 0
> \end{bmatrix}
> $$
> 
> where:
> - $$H_{\phi \phi}$$ is the $$N \times N$$ submatrix:
> $$
> (H_{\phi \phi})_{ij} = 2 \sum_{S \subseteq N: i, j \in S} q_{|S|}
> $$
> - $$\mathbf{1}$$ is an $$N \times 1$$ vector of ones.
> 
>4. **Positive Definiteness of the Hessian**
> 
> To ensure positive definiteness, check that $$v^\top \mathcal{H}_{\mathcal{L}} v > 0$$ for any non-zero vector $$v = \begin{bmatrix} u \\ v_\lambda \end{bmatrix}$$:
> $$
> v^\top \mathcal{H}_{\mathcal{L}} v = u^\top H_{\phi \phi} u + 2 v_\lambda (\mathbf{1}^\top u)
> $$
>$$H_{\phi \phi}$$ is positive definite, since: $$u^\top H_{\phi \phi} u = \sum_{j=1}^N \sum_{k=1}^N u_j u_k \frac{\partial \phi_j(x)}{\partial \phi_k(x)} \frac{\partial^2 F}{\partial \phi_j(x) \partial \phi_k(x)} = \sum_{S \subseteq N, j, k \in S} 2 q_{|S|}  \left( \sum_{j \in S} u_j \right)^2 > 0$$
> Since $$q_{|S|} > 0$$ and $$\left( \sum_{j \in S} u_j \right)^2 \geq 0$$ for all subsets $$S$$, the sum can only be zero if $$u_j = 0$$ for all $$j$$. If $$\mathbf{u}$$ is orthogonal to $$\mathbf{1}$$, then $$\mathbf{1}^\top \mathbf{u} = 0$$ and the Hessian still satisfies: $$\mathbf{v}^\top H_{\mathcal{L}} \mathbf{v} = \mathbf{u}^\top H_{\phi \phi} \mathbf{u} > 0$$


### Young's result from 1985 shows that linearity and null effects can be eliminated using a monotonicity axiom (does this mean they are equivilent entriely, or simply that monotonicity is stronger)


### Kernel-Shap
**TLDR; This is just some marketing done over the coalition problem from before.** 

- $$N$$ is the number of features. 
- $$w_{S}(x) = \sum_{j \in S} \phi_{\text{j}}(x)$$
- $$q_{|S|}$$ is a weighting that depends only on $$|S|$$.


**Optimization Problem:** $$\begin{align*}
\min_{\phi_1(x), \ldots, \phi_N(x)} & \; \sum_{S \subseteq N} \left[ w_S(x) - f_S(x) \right]^2 q_{|S|} \\
\text{subject to} \quad & w_{\{1, \ldots, N\}}(x) = \sum_{j=1}^N \phi_j(x) = f_{\{1, \ldots, N\}}(x) - f_\emptyset(x)
\end{align*}$$
In Kernel-Shap, $$q_{|S|}$$ is renamed to $$\kappa_{|S|}$$ - the "kernel", and defined as:
$$\kappa_{|S|} = \frac{(N-1)}{|S| \cdot (N - |S|) \cdot \binom{N}{|S|}} = \frac{(|S|-1)! \cdot (N-|S|-1)!}{N \cdot (N-2)!} = \frac{1}{N} \cdot \binom{N-2}{|S|-1}^{-1}$$
_**NOTE:**_ compare this to $$q_{|S|}$$ in shapley values:  $$q_{|S|} = \frac{1}{N} \cdot \binom{N-2}{|S|-1}^{-1}$$.

_**NOTE:**_ Another notation for $$\kappa_{|S|}$$ is $$\pi_x (S)$$.

_**NOTE:**_ This is _**not**_   $$p_S = \frac{|S|! \cdot (N - |S| - 1)!}{N!} = \frac{1}{N}\binom{N-1}{|S|}^{-1}$$ from the shapley value solutions:
$$\phi_j(x) = \sum_{S \subseteq [N] \setminus \{i\}} \frac{|S|! \cdot (N - |S| - 1)!}{N!} \left[f_{S \cup \{i\}}(x) - f_S(x)\right]$$

###### Note to myself - the approximations in Shapley Kernel Proof (Lundberg-Lee 2017) are completely off:
The following are computations I made myself.
$$(X^T W X)_{i,j} = \sum_{S \subseteq N} w(S) \cdot I[i \in S] \cdot I[j \in S]$$

$$(X^T W)_{i,S} = w(S) \cdot I[i \in S]$$

$$[(X^T W X)^{-1} X^T W]_{i,S} = \sum_j [(X^T W X)^{-1}]_{i,j} \cdot (X^T W)_{j,S} = \sum_j \left(\sum_{S' \subseteq N} w(S') \cdot I[i \in S'] \cdot I[j \in S']\right) \cdot (w(S) \cdot I[i \in S])$$

### Deep Shap

Deep Shap extends DeepLIFT; _presumably_ combining it with SHAP.

1. **Multiple Reference Points**:
	- **DeepLIFT**: Computes contributions relative to a single reference input $$\mathbf{x}^0$$.
	- **Deep SHAP**: Computes contributions $$C_{\Delta x_i}^{(k)}$$ over **multiple reference points** (samples them from a background distribution).

2. **Weighted Averaging**: 
   Deep Shap then averages these contributions across all references: $$\phi_i \approx \frac{1}{m} \sum_{k=1}^m C_{\Delta x_i}^{(k)}$$
****
### DeepLIFT (Deep Learning Important FeaTures)
DeepLIFT assigns contributions scores to each feature $$x_i$$ by comparing the output of a model for a given input to a reference value $$x_i ^{\text{ref}}$$.

- One approach is assigining contributions based on a taylor approximation:
	  $$f(\mathbf{x}) - f(\mathbf{x}^{\text{ref}}) \approx \sum_i \frac{\partial f(x_1^{\text{ref}}, \dots, x_i, \ldots, x_1^{\text{ref}})}{\partial z_i} \cdot (x_i - x_i ^{\text{ref}})$$
	Then, each contribution $$i$$ is $$\frac{\partial f(x_1^{\text{ref}}, \dots, x_i, \ldots, x_1^{\text{ref}})}{\partial z_i} \cdot (x_i - x_i ^{\text{ref}})$$ (the $$i$$-th term in the sum).
	However, $$\frac{\partial f(x_i)}{\partial z_i}$$ is prone to be zero due to activation functions known to have saturation behavior (sigmoid, tanh). This is particullary relevant in RNN variants, such as LSTM and GRU.

- Considering this, DeepLIFT propagates backwards a _difference-from-reference_.  
	Let: 
	- $$\Delta x_i = x_i - x_i^{\text{ref}}$$ is the difference between the input and the reference input.
	- $$\Delta y_i$$ is the difference between input and reference in layer subsequent to $$x_i$$.
	
	We _define multipliers_ $$m_{\Delta y_j \rightarrow \Delta x_i}$$ (per-scenrio), and we say it follows the chain rule (like gradients): $$\sum_j m_{\Delta f(\mathbf{x}) \rightarrow \Delta y_j} \cdot m_{\Delta y_j \rightarrow \Delta x_i} = m_{\Delta f(\mathbf{x}) \rightarrow \Delta x_i}$$. 
	The contribution is then defined as $$C_i = m_{\Delta f(\mathbf{x}) \rightarrow \Delta x_i} \cdot \Delta x_i$$

DeepLIFT assigns the contributions $$C_{\Delta x_i \rightarrow f(\mathbf{x})}$$ to reflect the total difference in outputs: $$f(x) - f(x^{\text{ref}})$$. Also known as the "summation-to-delta" property:
$$\sum_{i=1}^N C_{\Delta x_i \rightarrow f(\mathbf{x})} = f(\mathbf{x}) - f(\mathbf{x}^{\text{ref}})$$
**Linear Layers - "Linear Rule"**
In linear layers, $$y_j = \sum_i w_{ji} x_i + b_j$$. 
We define: 
$$m_{\Delta y_j \rightarrow \Delta x_i} = w_{ji}$$
Note that it obey the chain rule, because it coinsides with the gradient in this case.

**_Non_-Linear Layers - "Rescale Rule"**
We define: 
$$m_{\Delta y_j \rightarrow \Delta x_i} = \frac{y_j - y_j^{\text{ref}}}{x_i - x_i^{\text{ref}}}$$
Note that it obeys the chain rule: $$\sum_j m_{\Delta f(\mathbf{x}) \rightarrow \Delta y_j} \cdot m_{\Delta y_j \rightarrow \Delta x_i} = \sum_j \frac{f(\mathbf{x}) - f(\mathbf{x}^{\text{ref}})}{y_j - y_j^{\text{ref}}} \cdot \frac{y_j - y_j^{\text{ref}}}{x_i - x_i^{\text{ref}}} = m_{\Delta f(\mathbf{x}) \rightarrow \Delta x_i}$$ 

_**NOTE**_: Scaling a feature considerably affects $$m_{\Delta y_j \rightarrow \Delta x_i}$$ in this case.

_**However, we have activations to account for.**_
- Let $$\Delta a_i$$ be the difference in activations between input and reference.
- Let $$y_j = \sum_i w_{ji} x_i + b_j$$
Expanding $$\varphi(y_j)$$ around $$y_j^{\text{ref}}$$ using a first-order Taylor series gives: 
Re-arranging:
$$\varphi(y_j) - \varphi(y_j^{\text{ref}})\approx \varphi'(y_j^{\text{ref}}) \cdot (y_j - y_j^{\text{ref}})$$

Substituting: $$y_j - y_j^{\text{ref}} = \sum_i w_{ji} \cdot (x_i - x_i^{\text{ref}})$$ , we get:
$$\Delta a_i = \varphi(y_j) - \varphi(y_j^{\text{ref}})\approx \varphi'(y_j^{\text{ref}}) \cdot \sum_k w_{jk} \cdot (x_k - x_k^{\text{ref}})$$
Dividing both sides by $$\Delta x_i$$, we define $$m_{\Delta a_j \rightarrow \Delta x_i}$$ as: $$ \frac{\Delta a_i}{\Delta x_i}= \frac{\varphi(y_j) - \varphi(y_j^{\text{ref}})}{\Delta x_i} \approx \frac{\varphi'(y_j^{\text{ref}}) \cdot \sum_k w_{jk} \cdot (x_k - x_k^{\text{ref}})}{\Delta x_i} = m_{\Delta a_j \rightarrow \Delta x_i}$$
If the first order taylor approximation holds, we have a chain rule; 
Like before - division of ratios guarantees the chain rule. 
However, due to the approximation - on the right side we don't quite have a division of ratios.

 **_NOTE:_** **For activation functions such as RELU, this works extremely well**, since RELU is completely defined by its derivatives (being a piecewise linear function).

****
_**NOTE:**_ DeepLIFT has more nuances, such as the "reveal cancel rule" and positive-and-negative contributions. In practice, these aspects are not implemented in most packages.
****
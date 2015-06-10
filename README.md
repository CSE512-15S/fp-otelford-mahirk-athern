Galaxy Explorer
===============
Nicole Atherly (athern@uw.edu), Mahir Kothary (mahirk@uw.edu), and Grace Telford (otelford@uw.edu)

## Summary Image
![Overview](https://github.com/CSE512-15S/fp-otelford-mahirk-athern/raw/gh-pages/summary.png)

## Abstract
We present a tool that facilitates interactive exploration of correlations between parameters in a high-dimensional astronomy dataset. This dataset contains measurements of 25 properties of 10,000 galaxies derived from spectra from the Sloan Digital Sky Survey. Our web-based tool, implemented using D3 and JavaScript, allows the user to rapidly generate one and two-dimensional orthogonal projections of the dataset and dynamically change these projections. It also enables brushing and linking between plots so that the user can search for variations in the distribution of galaxies in different regions of parameter space. We obtain feedback on this tool from astronomers and other scientists, many of whom express interest in applying our system to enable exploration of other multidimensional datasets.

[Poster](https://github.com/CSE512-15S/fp-otelford-mahirk-athern/raw/gh-pages/final/poster-otelford-mahirk-athern.pdf),
[Final Paper](https://github.com/CSE512-15S/fp-otelford-mahirk-athern/raw/gh-pages/final/paper-otelford-mahirk-athern.pdf) 

## Running Instructions

Access our visualization at http://cse512-15s.github.io/fp-otelford-mahirk-athern/ or download this repository and run `python -m SimpleHTTPServer 9000` and access this from http://localhost:9000/.

## Development Process and Work Breakdown
#### Progression of the Design

Generally, our final design is similar to what we envisioned at the end of the storyboarding process. However, we did encounter unforeseen issues along the way that we had to deal with. 

Early on, we found an issue with the format of our dataset that led to certain regions of the scatter plot appearing discretized, so we chose an alternate data format. We then quickly realized that our approach of generating a scatter plot using D3 was incompatible with a very large dataset, so we selected a random sample of 10,000 galaxies from the full sample of 140,000 galaxies. This is sufficient for our goal of showing the distributions of the data in various one and two-dimensional projections.

Next, it becaome clear that outlying points in the data were causing the plots we generated to look very bad. We handled this by setting the axis limits equal to the mean value of each parameter +/- 3 times the standard deviation and demanding that each histogram has 10 equally spaced bins. Outliers in the scatter plot are made invisible.

The end result is a tool that meets the design requirements we outlined at the start and has attracted interest from users who would like to explore many different types of high-dimensional datasets.

#### Division of Labor

Nicole:
  - Brushing and linking

Mahir:
  - Overall design and User Interface (HTML/CSS)
  - Application Base 
  - Data Binning and Connections

Grace:
  - Project idea and data curation
  - Proposal, progress report and slides, poster, contributed to final paper
  - Contributed to drop down menus, formatting of histograms
  - Removing outlying datapoints from plots

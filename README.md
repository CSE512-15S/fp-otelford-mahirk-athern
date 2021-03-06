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

The main view in our tool is a scatter plot, which obviously suffers from some obscuration issues given that we are plotting 10,000 points. We experimented with reducing the opacity of the points so that the denser regions of the plot would be obvious, but this slowed the  rendering of the figures to an unacceptable level. We decided to keep the points opaque, but hope to add the ability to switch between a scatter plot and heat map in the future to better show the density of points in each two-dimensional projection.

The basic brushing selection box was simple to implement, but adding the histogram bars was more difficult. We found a few things difficult in this process. The first was that trying to draw in the additional histogram bars while in the middle of selecting points caused the brushing process to be very slow. Instead, we draw the bars once the brushing has ended. The second issue was that we could not simply draw the new bars in the brush end code, but rather had to remove each histogram completely and redraw them from scratch, with the addition of the new bars. Otherwise, they would not update correctly and it would seem that nothing changed after the first selection.

The end result is a tool that meets the design requirements we outlined at the start and has attracted interest from users who would like to explore many different types of high-dimensional datasets.

#### Division of Labor

Nicole:
  - Brushing and linking, histogram selection bar updates
  - Histogram tooltips
  - Contributions to final paper and initial research

Mahir:
  - Overall design and User Interface (HTML/CSS)
  - Application Base 
  - Data Binning and Connections
  - Contribution to the final paper

Grace:
  - Project idea and data curation
  - Proposal, progress report and slides, poster, contributed to final paper
  - Contributed to drop down menus, formatting of histograms
  - Removing outlying datapoints from plots

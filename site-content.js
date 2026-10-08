/* Edit verified author information and public URLs here. No metadata is inferred from AgentRVOS. */
window.SITE_CONFIG = {
  "projectTitle": "PlayGround: Progressive Layout Generation with Render-Grounded Planning",
  "authors": [
  {
    "name": "Jaeho Lee",
    "url": "https://jefflee0810.github.io/"
  },
  {
    "name": "Junhwan Heo",
    "url": "http://junhwan26.github.io/"
  },
  {
    "name": "Junghyun Park",
    "url": "https://junghyun-james-park.github.io/"
  },
  {
    "name": "WonJun Moon",
    "url": "https://wjun0830.github.io/"
  },
  {
    "name": "Eunju Yang",
    "url": "https://scholar.google.com/citations?hl=ko&user=ycUwZ1MAAAAJ"
  },
  {
    "name": "Seungho Jang",
    "url": "https://hugeson0235.github.io/"
  },
  {
    "name": "Seongchan Kim",
    "url": "https://github.com/deep-overflow"
  },
  {
    "name": "Seungryong Kim",
    "url": "https://cvlab.kaist.ac.kr/members",
    "marker": "†"
  }
],
  "affiliations": "KAIST AI",
  "authorNotes": "†: Corresponding Author",
  "venue": "arXiv 2026",
  "paperUrl": "",
  "codeUrl": "https://github.com/cvlab-kaist/PlayGround/tree/main",
  "citationComment": "Draft citation. Author names are supplied; final publication metadata is pending.",
  "provenance": "Table 1 and abstract: 8295_PLAYGROUND_Progressive_La (1).pdf, pp. 1 and 7. Figures: user-provided pdf.zip."
};

/* Table 1. Do not change the numbers without updating the manuscript/source. */
window.RESULTS = {
  "crello": [
    {
      "method": "FlexDM",
      "mean": [
        2.67,
        2.156,
        3.133,
        3.637,
        3.2,
        3.021
      ],
      "std": [
        0.69,
        0.656,
        0.705,
        0.581,
        0.74,
        0.992
      ],
      "rule": [
        0.1519,
        0.0583
      ]
    },
    {
      "method": "LaDeCo",
      "mean": [
        3.103,
        2.615,
        3.451,
        3.979,
        3.592,
        3.528
      ],
      "std": [
        0.722,
        0.809,
        0.721,
        0.574,
        0.743,
        1.029
      ],
      "rule": [
        0.057,
        0.0432
      ]
    },
    {
      "method": "PosterCopilot",
      "mean": [
        2.98,
        2.623,
        3.263,
        3.809,
        3.467,
        3.435
      ],
      "std": [
        0.729,
        0.81,
        0.776,
        0.653,
        0.784,
        1.073
      ],
      "rule": [
        0.0319,
        0.0374
      ]
    },
    {
      "method": "VFLM",
      "mean": [
        3.335,
        2.718,
        3.714,
        3.969,
        3.759,
        3.693
      ],
      "std": [
        0.564,
        0.645,
        0.576,
        0.565,
        0.642,
        0.947
      ],
      "rule": [
        0.0002,
        0.036
      ]
    },
    {
      "method": "PlayGround",
      "mean": [
        3.794,
        3.503,
        3.899,
        4.381,
        4.183,
        4.248
      ],
      "std": [
        0.583,
        0.66,
        0.587,
        0.542,
        0.635,
        0.919
      ],
      "rule": [
        0.0041,
        0.0345
      ]
    },
    {
      "method": "GT",
      "mean": [
        4.12,
        3.83,
        4.077,
        4.575,
        4.452,
        4.414
      ],
      "std": [
        0.509,
        0.49,
        0.635,
        0.522,
        0.555,
        0.88
      ],
      "rule": [
        0.0025,
        0.0235
      ]
    }
  ],
  "lica": [
    {
      "method": "FlexDM",
      "mean": [
        2.186,
        1.79,
        2.711,
        3.373,
        2.742,
        1.889
      ],
      "std": [
        0.529,
        0.581,
        0.811,
        0.625,
        0.73,
        0.83
      ],
      "rule": [
        0.3212,
        0.0574
      ]
    },
    {
      "method": "LaDeCo",
      "mean": [
        2.889,
        2.444,
        3.294,
        3.965,
        3.501,
        3.171
      ],
      "std": [
        0.76,
        0.81,
        0.798,
        0.634,
        0.799,
        1.101
      ],
      "rule": [
        0.0715,
        0.0393
      ]
    },
    {
      "method": "PosterCopilot",
      "mean": [
        2.929,
        2.731,
        3.395,
        3.961,
        3.581,
        3.097
      ],
      "std": [
        0.787,
        0.983,
        0.856,
        0.679,
        0.827,
        1.244
      ],
      "rule": [
        0.1372,
        0.0281
      ]
    },
    {
      "method": "VFLM",
      "mean": [
        3.427,
        2.933,
        3.977,
        4.157,
        4.022,
        3.647
      ],
      "std": [
        0.657,
        0.718,
        0.653,
        0.586,
        0.662,
        1.007
      ],
      "rule": [
        0.0001,
        0.0216
      ]
    },
    {
      "method": "PlayGround",
      "mean": [
        3.698,
        3.48,
        3.97,
        4.378,
        4.217,
        4.224
      ],
      "std": [
        0.71,
        0.731,
        0.722,
        0.545,
        0.693,
        0.906
      ],
      "rule": [
        0.0482,
        0.0199
      ]
    },
    {
      "method": "GT",
      "mean": [
        4.376,
        4.15,
        4.512,
        4.699,
        4.749,
        4.884
      ],
      "std": [
        0.541,
        0.459,
        0.531,
        0.463,
        0.454,
        0.358
      ],
      "rule": [
        0.004,
        0.0162
      ]
    }
  ]
};

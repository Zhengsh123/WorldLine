<div align="center">

# WorldLine: Action-Driven Visual Simulation for Robotic Manipulation

Shenghe Zheng<sup>1</sup>, Wenbo Li<sup>2,†</sup>, Jiyao Zhang<sup>3</sup>, Bin Xia<sup>4</sup>, Haoyang Huang<sup>2</sup>, Nan Duan<sup>2</sup>, Jiaya Jia<sup>1,‡</sup>

<sup>1</sup>HKUST · <sup>2</sup>Joy Future Academy · <sup>3</sup>Peking University · <sup>4</sup>CUHK

† Project Lead · ‡ Corresponding Author

[![Paper](https://img.shields.io/badge/Paper-arXiv-b23a2f?style=flat&labelColor=555555)](https://arxiv.org/abs/2609.38059)
[![Project](https://img.shields.io/badge/Project-Page-63b32e?style=flat&labelColor=555555)](https://zhengsh123.github.io/WorldLine/)
[![Demo](https://img.shields.io/badge/Demo-Video_Results-387bb5?style=flat&labelColor=555555)](https://zhengsh123.github.io/WorldLine/#video-results)

</div>

## Overview

WorldLine is an action-driven visual simulator that predicts how robot actions change a scene before physical execution. It learns transferable robot–object dynamics from action-free video, then grounds different robots' controls in a shared image-space action representation.

[![WorldLine: action-conditioned visual predictions across robot embodiments and camera views](https://zhengsh123.github.io/WorldLine/media/figures/worldline-teaser.png)](https://zhengsh123.github.io/WorldLine/#overview)

## Highlights

- **Learn transferable dynamics:** Pretrain on more than **10,000 hours** of action-free robot video.
- **Ground actions across embodiments:** Use over **2,000 hours** of action trajectories from more than **10 robot embodiments**, represented as calibrated image-space action maps.
- **Preserve interactions:** Use multi-view and failure-enriched training with relational regularization to model robot–object motion, not just visual appearance.
- **Roll out efficiently:** Distill the simulator into a causal, block-autoregressive model with four denoising steps per block.

## Results

| Evaluation | WorldLine result |
|:--|:--|
| Robot-mask IoU on failed trajectories | **+0.1626** over the strongest baseline |
| Trajectory-success prediction on RoboTwin and AgiBot | **74%** mean accuracy, 1 percentage point above the strongest baseline |
| Out-of-domain RoboTwin planning | **Up to +21.4 percentage points** task success over direct policy execution, without RoboTwin training or adaptation |

Explore the full [performance summary](https://zhengsh123.github.io/WorldLine/#performance) and synchronized qualitative comparisons:

| Gallery | What to explore |
|:--|:--|
| [Multi-view predictions](https://zhengsh123.github.io/WorldLine/#worldline-results) | Ground truth and WorldLine predictions across camera views on DROID and AgibotWorld |
| [Method comparisons](https://zhengsh123.github.io/WorldLine/#comparative-experiments) | Side-by-side predictions from WorldLine and comparison methods |
| [Long-horizon rollouts](https://zhengsh123.github.io/WorldLine/#worldline-causal) | Causal action-conditioned generation over longer sequences |
| [Ablations](https://zhengsh123.github.io/WorldLine/#ablation-study) | Effects of training and representation choices |

The [interactive project page](https://zhengsh123.github.io/WorldLine/) supports synchronized playback and scrubbing within each example. Task text labels the examples; it is **not** an inference input to WorldLine.

## Method

1. **Pretrain on robot dynamics:** Adapt a video model using broad action-free robot footage.
2. **Ground actions in image space:** Project end-effector position, depth, orientation, and gripper state into calibrated camera views for a shared control interface.
3. **Generate causal futures:** Condition subsequent video blocks on updated actions for interactive rollout.

See the [method overview](https://zhengsh123.github.io/WorldLine/#method-overview) and the [paper](https://arxiv.org/abs/2609.38059) for details.

## Repository

- `main` presents the research, results, and links to the demos. Training and inference code are not included in this branch at present.
- `gh-pages` contains the project website and video assets, published at the [project page](https://zhengsh123.github.io/WorldLine/).

## Contact

For research questions or collaboration, contact [Shenghe Zheng](mailto:shenghez.zheng@gmail.com).

## Citation

If you find WorldLine useful, please cite our [paper](https://arxiv.org/abs/2609.38059):

```bibtex
@misc{zheng2026worldline,
  title={WorldLine: Action-Driven Visual Simulation for Robotic Manipulation},
  author={Shenghe Zheng and Wenbo Li and Jiyao Zhang and Bin Xia and Haoyang Huang and Nan Duan and Jiaya Jia},
  year={2026},
  eprint={2609.38059},
  archivePrefix={arXiv},
  url={https://arxiv.org/abs/2609.38059}
}
```

[Download BibTeX](citation.bib)

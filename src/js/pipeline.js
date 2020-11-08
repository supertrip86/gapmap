import utilities from "../js/utilities.js";
import pipelineTemplate from "../hbs/pipeline.hbs";
import "../css/pipeline.css";

const cssAnimation = (data) => {
    return `
        <style>
            @keyframes rotate-one {
                100% {
                    transform: rotate(${data[0]});
                }
            }
            @keyframes rotate-two {
                0% {
                    transform: rotate(${data[0]});
                }
                100% {
                    transform: rotate(${data[1]});
                }
            }
            @keyframes rotate-three {
                0% {
                    transform: rotate(${data[1]});
                }
                100% {
                    transform: rotate(${data[2]});
                }
            }
            @keyframes rotate-four {
                0% {
                    transform: rotate(${data[2]});
                }
                100% {
                    transform: rotate(${data[3]});
                }
            }
            .chart-pipeline li:nth-child(1) span {
                transform: rotate(-${data[0]});
            }
            .chart-pipeline li:nth-child(2) span {
                transform: rotate(-${data[1]});
            }
            .chart-pipeline li:nth-child(3) span {
                transform: rotate(-${data[2]});
            }
            .chart-pipeline li:nth-child(4) span {
                transform: rotate(-${data[3]});
            }
        </style>
    `;
};

const setPercentages = (data) => {
    data.forEach((i, j) => {
        (i > 0) && (document.getElementById(`chart-percentage-${j + 1}`).innerText = `${i.toFixed(2) * 100}%`);
    });
};

const setLabels = (data) => {
    const status = gapmap.data.status;

    data.forEach((i, j) => {
        (i > 0) && (document.getElementById(`chart-label-${j + 1}`).innerText = status[j]);
    });
};

const getDegrees = (value) => {
    const degrees = parseInt(value * 180);

    return `${degrees}deg`;
};

const setPipelineAnimations = () => {
    const projects = gapmap.data.projects;

    const a = projects.filter((i) => i.Status == 0).length / projects.length;
    const b = projects.filter((i) => i.Status == 1).length / projects.length;
    const c = projects.filter((i) => i.Status == 2).length / projects.length;
    const d = projects.filter((i) => i.Status == 3).length / projects.length;
    
    const data = [getDegrees(a), getDegrees(a + b), getDegrees(a + b + c), getDegrees(a + b + c + d)];
    const css = cssAnimation(data);

    setPercentages([a,b,c,d]);
    setLabels([a,b,c,d]);

    document.head.insertAdjacentHTML('beforeend', css);
};

export { pipelineTemplate, setPipelineAnimations }
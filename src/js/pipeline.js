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

const setValues = (data) => {
    data.forEach((i, j) => {
        (i > 0) && (document.getElementById(`chart-percentage-${j + 1}`).innerText = i);
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

    const w = projects.filter((i) => i.Status == 0).length;
    const x = projects.filter((i) => i.Status == 1).length;
    const y = projects.filter((i) => i.Status == 2).length;
    const z = projects.filter((i) => i.Status == 3).length;

    const a = w / projects.length;
    const b = x / projects.length;
    const c = y / projects.length;
    const d = z / projects.length;
    
    const data = [getDegrees(a), getDegrees(a + b), getDegrees(a + b + c), getDegrees(a + b + c + d)];
    const css = cssAnimation(data);

    setValues([w,x,y,z]);
    setLabels([a,b,c,d]);

    document.head.insertAdjacentHTML('beforeend', css);
};

export { pipelineTemplate, setPipelineAnimations }
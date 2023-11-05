import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import React, { useState } from 'react';
import CourseSummaryForm from './CourseSummaryForm';
import AssignmentForm from './AssignmentForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { calculateAverages, deepCopyCourses, difference } from '../utils/generalFunctions';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTranslation } from 'react-i18next';

function Simulation({ courses, simulationData, setSimulationData, setDegreeAvg, setYearAvgs, yearAvgs, degreeAvg }) {

    const { t }= useTranslation('translation', { keyPrefix: 'Simulation' });
    
    const [coursesTemp, setCoursesTemp] = useState(deepCopyCourses(courses));
    const [yearAvgsTemp, setYearAvgsTemp] = useState(yearAvgs);
    const [degreeAvgTemp, setDegreeAvgTemp] = useState(degreeAvg);

    const changeAssignments = (e, index, indexCourse) => {
        const { name, value } = e.target;
        const temp = [...simulationData.courses];
        temp[indexCourse].assignments[index][name] = value;
        setSimulationData({courses: temp, ...simulationData});
        let temp2 = coursesTemp.map((semester) => {
            semester.courses = semester.courses.map((course2) => {
                if(course2._id === temp[indexCourse]._id) {
                    return temp[indexCourse];
                }
                return course2;
            })
            return semester;
        });
        let calculated = calculateAverages(temp2);
        setDegreeAvgTemp(calculated[1]);
        setYearAvgsTemp(calculated[2]);
        setCoursesTemp(calculated[0]);
    }

    const changeForm = (e, index) => {
        const { name, value } = e.target;
        const temp = [...simulationData.courses];
        temp[index][name] = value;
        setSimulationData({courses: temp, ...simulationData});
        let temp2 = coursesTemp.map((semester) => {
            semester.courses = semester.courses.map((course2) => {
                if(course2._id === temp[index]._id) {
                    return temp[index];
                }
                return course2;
            })
            return semester;
        });
        let calculated = calculateAverages(temp2);
        setDegreeAvgTemp(calculated[1]);
        setYearAvgsTemp(calculated[2]);
        setCoursesTemp(calculated[0]);
    }

  return (
    <>
    <div className='averages'>
        <div className='circleContainer'>
            <CircularProgressbarWithChildren value={degreeAvgTemp}>
                <Typography >{t("degreeAvg")}</Typography>
                <Typography>{degreeAvgTemp}</Typography>
                <Typography className='circleAvgC' sx={{color: difference(degreeAvg, degreeAvgTemp).color}}>
                    {difference(degreeAvg, degreeAvgTemp).color !== 'black' ? difference(degreeAvg, degreeAvgTemp).diff : ""}
                    {difference(degreeAvg, degreeAvgTemp).color === 'red' ? <ArrowDownwardIcon/> : difference(degreeAvg, degreeAvgTemp).color === 'green' ? <ArrowUpwardIcon/> : ""}
                </Typography>
            </CircularProgressbarWithChildren>
        </div>
        {yearAvgsTemp.map((yearAvg, index) => {
            let exists = false;
            for(let i = 0; i < simulationData.courses.length; i++) {
                if(simulationData.courses[i].year === index + 1) {
                    exists = true;
                    break;
                }
            }
            if(!exists) {
                return <></>
            }
            return (
                <div key={index} className='circleContainer'>
                    <CircularProgressbarWithChildren value={yearAvg}>
                        <Typography>{t("year")} {index + 1}</Typography>
                        <Typography>{yearAvg}</Typography>
                        <Typography className='circleAvgC' sx={{color: difference(yearAvgs[index], yearAvg).color}}>
                            {difference(yearAvgs[index], yearAvg).color !== 'black' ? difference(yearAvgs[index], yearAvg).diff : ""}
                            {difference(yearAvgs[index], yearAvg).color === 'red' ? <ArrowDownwardIcon/> : difference(yearAvgs[index], yearAvg).color === 'green' ? <ArrowUpwardIcon/> : ""}
                        </Typography>
                    </CircularProgressbarWithChildren>
                </div>
            )
        })}
        {coursesTemp.map((semester, index) => {
            let exists = false;
            for(let i = 0; i < simulationData.courses.length; i++) {
                if(simulationData.courses[i].semester === semester._id.semester && simulationData.courses[i].year === semester._id.year) {
                    exists = true;
                    break;
                }
            }
            if(!exists) {
                return <></>
            }
            return (
                <div key={index} className='circleContainer'>
                    <CircularProgressbarWithChildren value={semester._id.avg}>
                        <Typography>{t("year")} {semester._id.year}</Typography>
                        <Typography>{t("semester")} {semester._id.semester}</Typography>
                        <Typography>{semester._id.avg}</Typography>
                        <Typography className='circleAvgC' sx={{color: difference(courses[index]._id.avg, semester._id.avg).color}}>
                            {difference(courses[index]._id.avg, semester._id.avg).color !== 'black' ? difference(courses[index]._id.avg, semester._id.avg).diff : ""}
                            {difference(courses[index]._id.avg, semester._id.avg).color === 'red' ? <ArrowDownwardIcon/> : difference(courses[index]._id.avg, semester._id.avg).color === 'green' ? <ArrowUpwardIcon/> : ""}
                        </Typography>
                    </CircularProgressbarWithChildren>
                </div>
            )
        })}
    </div>
    <div className='courses'>
    {simulationData.courses.map((course, indexCourse) => {
        return (
            <Accordion sx={{width: "100%"}} key={course._id} expanded={!simulationData.ids.includes(course._id)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content">
                        <CourseSummaryForm form={course} index={indexCourse} simulation={true} disableGrade={!simulationData.ids.includes(course._id)} changeForm={changeForm}/>
                    </AccordionSummary>
                    <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                    <Divider orientation='horizontal'/>
                    <div style={{width: "100%"}}>
                        {course.assignments.map((ass, index) => {
                            if(simulationData.ids.includes(ass._id)) {
                                return (
                                    <AssignmentForm assignment={ass} indexCourse={indexCourse} index={index} simulation={true} changeAssignments={changeAssignments} />
                                )
                            }
                            return <></>
                        })}
                    </div>
                    </AccordionDetails>
                </Accordion>
        )
    })}
    </div>
    </>
  )
}

export default Simulation
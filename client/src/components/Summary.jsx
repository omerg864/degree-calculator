import React, { useState } from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Summary({courses, yearsAvg, degreeAvg}) {

    const { t } = useTranslation("translation", { keyPrefix: "Summary"});

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };

    const countPoints = (year) => {
        let points = 0;
        courses.forEach((semester) => {
            if(semester._id.year === year + 1) {
                points += semester._id.sumAllPoints;
            }
        })
        return points;
    }

    console.log(courses);

    const countDegreePoints = () => {
        let points = 0;
        courses.forEach((semester) => {
            points += semester._id.sumAllPoints;
        })
        return points;
    }

    const countDegreeAvgPoints = () => {
        let points = 0;
        courses.forEach((semester) => {
            points += semester._id.points;
        })
        return points;
    }

    const countDegreeOngoingCourses = () => {
        let coursesCount = 0;
        courses.forEach((semester) => {
            coursesCount += semester._id.OngoingCourses;
        })
        return coursesCount;
    }

    const countDegreeCompletedCourses = () => {
        let coursesCount = 0;
        courses.forEach((semester) => {
            coursesCount += semester._id.completedCourses;
        })
        return coursesCount;
    }

    const countDegreeBinaryPass = () => {
        let coursesCount = 0;
        courses.forEach((semester) => {
            coursesCount += semester._id.binaryPass;
        })
        return coursesCount;
    }

  return (
    <div style={{width: "100%", textAlign: 'center'}}>
        <h1>{t("summary")}</h1>
        <div style={{width: "100%", display: "flex", justifyContent: "center", marginBottom: '10px'}}>
        <Accordion sx={{width: "100%"}} expanded={expanded === -1} onChange={handleChange(-1)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content">
                            <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                <Typography>
                                    {t("degree")}
                                </Typography>
                                <div className='row'>
                                <Typography>
                                    {countDegreePoints()} {t("credits")}
                                </Typography>
                                <Divider orientation='vertical' sx={{height: "70%"}}/>
                                    <Typography>
                                        {degreeAvg}
                                    </Typography>
                                    <div style={{width: "1.5rem", height: "1.9rem"}}>
                                        <CircularProgressbar value={degreeAvg}/>
                                    </div>
                                </div>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                        <Divider orientation='horizontal'/>
                        <div style={{width: "100%"}}>
                                    <Box >
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("creditsForAvg")}
                                            </Typography>
                                                <Typography>
                                                    {countDegreeAvgPoints()}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("credits")}
                                            </Typography>
                                                <Typography>
                                                    {countDegreePoints()}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("courses")}
                                            </Typography>
                                                <Typography>
                                                    {countDegreeOngoingCourses() + countDegreeCompletedCourses()}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("completed")}
                                            </Typography>
                                                <Typography>
                                                    {countDegreeCompletedCourses()}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("binaryPass")}
                                            </Typography>
                                                <Typography>
                                                    {countDegreeBinaryPass()}
                                                </Typography>
                                        </Box>
                                        <Divider orientation='horizontal'/>
                                    </Box>
                        </div>
                        </AccordionDetails>
                    </Accordion>
        </div>
        <div className='courses'>
            {yearsAvg.map((yearAvg, index) => {
                return (
                    <Accordion sx={{width: "100%"}} key={`year ${index}`} expanded={expanded === index} onChange={handleChange(index)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content">
                            <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                <Typography>
                                    {t("year")} {index + 1}
                                </Typography>
                                <div className='row'>
                                <Typography>
                                    {countPoints(index)} {t("credits")}
                                </Typography>
                                <Divider orientation='vertical' sx={{height: "70%"}}/>
                                    <Typography>
                                        {yearAvg}
                                    </Typography>
                                    <div style={{width: "1.5rem", height: "1.9rem"}}>
                                        <CircularProgressbar value={yearAvg}/>
                                    </div>
                                </div>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                        <Divider orientation='horizontal'/>
                        <div style={{width: "100%"}}>
                            {courses.map((semester, index2) => {
                                if(semester._id.year !== index + 1) {
                                    return <></>
                                }
                                return (
                                    <Box key={`sem ${index2}`}>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {semester._id.semester === 4 ? t("yearlyCourses") :  t("semester")} {semester._id.semester === 4 ? null : semester._id.semester}
                                            </Typography>
                                            <div className='row'>
                                                <Typography>
                                                    {semester._id.avg}
                                                </Typography>
                                                <div style={{width: "1.5rem", height: "1.9rem"}}>
                                                    <CircularProgressbar value={semester._id.avg}/>
                                                </div>
                                            </div>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("creditsForAvg")}
                                            </Typography>
                                                <Typography>
                                                    {semester._id.points}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("credits")}
                                            </Typography>
                                                <Typography>
                                                    {semester._id.sumAllPoints}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("courses")}
                                            </Typography>
                                                <Typography>
                                                    {semester.courses.length}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("completed")}
                                            </Typography>
                                                <Typography>
                                                    {semester._id.completedCourses}
                                                </Typography>
                                        </Box>
                                        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
                                            <Typography>
                                                {t("binaryPass")}
                                            </Typography>
                                                <Typography>
                                                    {semester._id.binaryPass}
                                                </Typography>
                                        </Box>
                                        <Divider orientation='horizontal'/>
                                    </Box>
                                )
                            })}
                        </div>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
    </div>
  )
}

export default Summary
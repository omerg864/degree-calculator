import React, { useEffect, useState } from 'react';
import { arrayIncludes, calculateCourse } from '../utils/generalFunctions';
import { IconButton, Divider, Accordion, AccordionSummary, AccordionDetails, Button, Checkbox, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SemesterSlider from '../components/SemesterSlider.jsx';
import AssignmentView from '../components/AssignmentView';
import AssignmentForm from '../components/AssignmentForm';
import CourseSummaryView from '../components/CourseSummaryView';
import CourseSummaryForm from '../components/CourseSummaryForm';
import YearSlider from '../components/YearSlider';
import { useTranslation } from "react-i18next";


function Main({ courses, year, semester, yearAvgs, degreeAvg, plusYear, plusSemester, minusSemester, minusYear, deleteCourse, updateCourse,
    createCourse, simulation, simulationData, setSimulationData, setSimulation }) {

    const { t }= useTranslation('translation', { keyPrefix: 'Main' });


    const [expanded, setExpanded] = useState(false);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        name: "",
        grade: 0,
        assignments: [],
        points: 0,
        _id: "",
        binaryPass: false,
        semester: 1,
        year: 1
    });
    const [newCourse, setNewCourse] = useState(false);

    useEffect(() => {
        if(simulation) {
            setEdit(false);
            setNewCourse(false);
        }
    }, [simulation])

    const toggleSelectCourse = (e, course) => {
        e.stopPropagation();
        let exist = false;
        exist = simulationData.courses.findIndex(c => c._id === course._id) !== -1;
            let courses;
            if(exist) {
                courses = simulationData.courses;
            } else {
                courses = [...simulationData.courses, course];
            }
        if(simulationData.ids.includes(course._id)) {
            setSimulationData({courses: simulationData.courses.filter((c) => c._id !== course._id), ids: simulationData.ids.filter((id) => id !== course._id)});
        } else {
            setSimulationData({courses, ids: [...simulationData.ids, course._id]});
        }
    }

    const toggleCourseAssignment = (e, assignmentId, course) => {
        e.stopPropagation();
        let exist = false;
        if(simulationData.ids.includes(assignmentId)) {
            for(let i = 0; i < course.assignments.length; i++) {
                if(simulationData.ids.includes(course.assignments[i]._id) && course.assignments[i]._id !== assignmentId) {
                    exist = true;
                    break;
                }
            }
            let courses;
            if(exist) {
                courses = simulationData.courses;
            } else {
                courses = simulationData.courses.filter((c) => c._id !== course._id);
            }
            setSimulationData({courses, ids: simulationData.ids.filter((id) => id !== assignmentId)});
        } else {
            let selectedTemp = simulationData.ids.filter(id => id !== course._id);
            exist = simulationData.courses.findIndex(c => c._id === course._id) !== -1;
            let courses;
            if(exist) {
                courses = simulationData.courses;
            } else {
                courses = [...simulationData.courses, course];
            }
            setSimulationData({courses, ids: [...selectedTemp, assignmentId]});
        }
    }

    const removeNewCourse = () => {
        setNewCourse(false);
        setExpanded(false);
    }

    const deleteAssignment = (e, index) => {
        let assignments = form.assignments.filter((ass, index2) => index2 !== index);
        setForm({...form, assignments});
    }

    const openNewCourse = () => {
        if(!newCourse) {
            setNewCourse(true);
            setForm({
                name: "",
                grade: 0,
                assignments: [],
                points: 0,
                binaryPass: false,
                _id: "",
            });
            setExpanded("new");
            setEdit(false);
            setSimulation(false);
        }
    }

    const editCourse = (course) => {
        setEdit(course._id);
        let assignments = course.assignments.map(ass => {
            return {...ass};
        })
        setForm({...course, assignments: assignments});
    }

    const changeForm = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const changeCheckBox = (e) => {
        setForm({...form, [e.target.name]: e.target.checked})
    }

    const changeAssignments = (e, index) => {
        let ass = form.assignments.map((ass, index2) => {
            if(index === index2) {
                ass[e.target.name] = e.target.value;
            }
            return ass;
        })
        setForm({...form, grade: calculateCourse(ass), assignments: ass});
    }

    const newAssignment = (e) => {
        let assignments = [...form.assignments];
        assignments.push({
            name: "",
            grade: 0,
            percent: 0,
            new: true
        });
        setForm({...form, assignments});
    }

    const handleExpand = (panel) => (event, isExpanded) => {
        if(edit && edit !== panel) {
            setEdit(false);
        }
        if(newCourse && panel !== "new") {
            setNewCourse(false);
        }
        setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
    <YearSlider year={year} yearAvgs={yearAvgs} plusYear={plusYear} minusYear={minusYear}/>
    <div className='courses'>
    {courses.filter((semesters) => semesters._id.year === year && semester === semesters._id.semester).length ? null : 
    <>
        <SemesterSlider semester={semester} plusSemester={plusSemester} minusSemester={minusSemester} avg={0}/>
    </>}
    {courses.filter((semesters) => semesters._id.year === year && semester === semesters._id.semester).map((course) => {
        return <div style={{width: "100%"}} key={`${semester}-${year}`}>
        <SemesterSlider semester={semester} plusSemester={plusSemester} minusSemester={minusSemester} avg={course._id.avg}/>
        {course.courses.map((c) => {
            return (
                <Accordion sx={{width: "100%"}} key={c._id} expanded={expanded === c._id || expanded === "all"} onChange={handleExpand(c._id)}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    >
                    {edit !== c._id ? <CourseSummaryView course={c} select={simulation} disabled={arrayIncludes(simulationData.ids, c.assignments.map(ass => ass._id)) || c.binaryPass} checked={simulationData.ids.filter((id) => id === c._id).length !== 0} toggleCourse={toggleSelectCourse} /> 
                    : <CourseSummaryForm form={form} changeForm={changeForm}/>}
                    </AccordionSummary>
                    <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                    <Divider orientation='horizontal'/>
                    <div style={{width: "100%"}}>
                        {edit !== c._id ?
                        c.assignments.map(ass => {
                            return (
                                <AssignmentView key={ass._id} course={c} disabled={c.binaryPass} checked={simulationData.ids.filter((id) => id === ass._id).length !== 0} assignment={ass} select={simulation} toggleCourseAssignment={toggleCourseAssignment}  />
                            )
                        }) : form.assignments.map((ass, index) => {
                            return (
                                <AssignmentForm key={ass._id} assignment={ass} index={index} changeAssignments={changeAssignments} deleteAssignment={deleteAssignment}/>
                            )
                        })}
                    </div>
                    {edit === c._id ? <IconButton onClick={newAssignment}>
                                        <AddIcon sx={{color: "green"}}/>
                                    </IconButton> : <></>}
                    {edit === c._id ? <div><FormControlLabel sx={{margin: 0}} control={<Checkbox onChange={changeCheckBox} name="binaryPass" checked={form.binaryPass} />} label={t("binaryPass")} /></div> : <></>}
                    {simulation ? <></> : edit === c._id ? <div className='space' style={{padding: "1rem 1rem"}}>
                        <Button aria-label="delete Course" variant="outlined" color="error" onClick={() => deleteCourse(c._id, setEdit, setExpanded)}>
                            {t("delete")}
                        </Button>
                        <Button aria-label="update Course" variant="contained" color="primary" id='btn-primary' onClick={() => updateCourse(c._id, form, setEdit, setExpanded)}>
                        {t("save")}
                        </Button>
                    </div> : <div className='edit-container'>
                            <Button aria-label="edit Course" variant="contained" color="primary" id='btn-primary' onClick={() => {editCourse(c)}}>
                            {t("edit")}
                            </Button>
                        </div>}
                    </AccordionDetails>
                </Accordion>
            )
        })}
            </div>
    })}
    {newCourse ? <>
        <Accordion sx={{width: "100%"}} expanded={expanded === "new"} onChange={handleExpand("new")}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    >
                    <CourseSummaryForm form={form} changeForm={changeForm}/>
                    </AccordionSummary>
                    <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                    <Divider orientation='horizontal'/>
                    <div style={{width: "100%"}}>
                        {form.assignments.map((ass, index) => {
                            return (
                                <AssignmentForm assignment={ass} index={index} changeAssignments={changeAssignments} deleteAssignment={deleteAssignment}/>
                            )
                        })}
                    </div>
                    <IconButton onClick={newAssignment}>
                        <AddIcon sx={{color: "green"}}/>
                    </IconButton>
                    <div className='space' style={{padding: "1rem 1rem"}}>
                        <Button aria-label="remove new course" variant="contained" color="error" onClick={removeNewCourse}>
                        {t("delete")}
                        </Button>
                        <Button aria-label="create Course" variant="contained" color="primary" id='btn-primary' onClick={() => createCourse(form, setExpanded, setNewCourse)}>
                        {t("save")}
                        </Button>
                    </div>
                    </AccordionDetails>
                </Accordion>
    </> : <></>}
    <Button aria-label="open new Course" sx={{width: "fit-content", margin: "0.7rem 0"}} onClick={openNewCourse}>
        {t("newCourse")}
    </Button>
    </div>
    </>
  )
}

export default Main;
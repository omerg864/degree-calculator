import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import Spinner from '../components/Spinner';
import { calculateAverages, calculateSemesterAvg } from '../utils/generalFunctions';
import { IconButton, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Button, TextField, Fab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SemesterSlider from '../components/SemesterSlider.jsx';
import AssignmentView from '../components/AssignmentView';
import AssignmentForm from '../components/AssignmentForm';
import CourseSummaryView from '../components/CourseSummaryView';
import CourseSummaryForm from '../components/CourseSummaryForm';
import YearSlider from '../components/YearSlider';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import CloseIcon from '@mui/icons-material/Close';


function Home({ isAuthenticated}) {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [year, setYear] = useState(1);
    const [semester, setSemester] = useState(1);
    const [yearAvgs, setYearAvgs] = useState([]);
    const [degreeAvg, setDegreeAvg] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        name: "",
        grade: 0,
        assignments: [],
        points: 0,
        _id: "",
        semester: 1,
        year: 1
    });
    const [newCourse, setNewCourse] = useState(false);
    const [simulationSelect, setSimulationSelect] = useState(false);
    const cookies = new Cookies();

    useEffect(()=> {
        if(!isAuthenticated) {
            navigate('/login');
        }

    }, [isAuthenticated, navigate])

    const handleExpand = (panel) => (event, isExpanded) => {
        if(edit && edit !== panel) {
            setEdit(false);
        }
        if(newCourse && panel !== "new") {
            setNewCourse(false);
        }
        setExpanded(isExpanded ? panel : false);
    };

    const plusYear = () => {
        setYear(year + 1);
    }

    const minusYear = () => {
        setYear(year - 1);
    }

    const plusSemester = () => {
        setSemester(semester + 1);
    }

    const minusSemester = () => {
        setSemester(semester - 1);
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

    const changeAssignments = (e, index) => {
        setForm({...form, assignments: form.assignments.map((ass, index2) => {
            if(index === index2) {
                ass[e.target.name] = e.target.value;
            }
            return ass;
        })});
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
                _id: "",
            });
            setExpanded("new");
            setEdit(false);
        }
    }

    const createCourse = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/course/`, { headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${cookies.get('userToken')}`
            } ,method: 'POST', body: JSON.stringify({...form, semester, year})});
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                let coursesTemp;
                let semester1 = courses.find((sem) => sem._id.year === year && sem._id.semester === semester);
                if(semester1) {
                    coursesTemp = courses.map((sem) => {
                        if(sem._id.year === year && sem._id.semester === semester) {
                            sem.courses.push(data.course);
                        }
                        return sem;
                    })
                    let calculated = calculateAverages(coursesTemp);
                    setCourses(calculated[0]);
                    setDegreeAvg(calculated[1]);
                    setYearAvgs(calculated[2]);
                } else {
                    let coursesTemp = [...courses, {
                        courses: [data.course],
                        _id: {
                            year,
                            semester
                        }
                    }];
                    let calculated = calculateAverages(coursesTemp);
                    setCourses(calculated[0]);
                    setDegreeAvg(calculated[1]);
                    setYearAvgs(calculated[2]);
                }
                setExpanded(false);
                setNewCourse(false);
                toast.success("Course Added");
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const removeNewCourse = () => {
        setNewCourse(false);
        setExpanded(false);
    }

    const updateCourse = async (id) => {
        setEdit(false);
        setExpanded(false);
        setIsLoading(true);
        try {
            const response = await fetch(`/api/course/${id}`, { headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${cookies.get('userToken')}`
            } ,method: 'PUT', body: JSON.stringify(form) })
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                let coursesTemp = courses.map((sem) => {
                    sem.courses = sem.courses.map((course) => {
                        if(course._id === id) {
                            course = data.course;
                        }
                        return course;
                    });
                    return sem;
                });
                let calculated = calculateAverages(coursesTemp);
                setCourses(calculated[0]);
                setDegreeAvg(calculated[1]);
                setYearAvgs(calculated[2]);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const deleteCourse = async (id) => {
        setEdit(false);
        setExpanded(false);
        setIsLoading(true);
        try {
            const response = await fetch(`/api/course/${id}`, { headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${cookies.get('userToken')}`
            } ,method: 'DELETE'})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                let coursesTemp = courses.map((sem) => {
                    sem.courses = sem.courses.filter((course) => course._id !== id);
                    return sem;
                });
                let calculated = calculateAverages(coursesTemp);
                setCourses(calculated[0]);
                setDegreeAvg(calculated[1]);
                setYearAvgs(calculated[2]);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const selectSimulation = () => {
        if(simulationSelect) {
            setSimulationSelect(false);
            return;
        }
        setSimulationSelect(true);
        setEdit(false);
        setNewCourse(false);
    }

    const toggleSelectCourse = (e) => {
        e.stopPropagation();
    }

    const toggleCourseAssignment = (e) => {

    }

    const getCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/course/`, { headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${cookies.get('userToken')}`
            } ,method: 'GET'})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                let calculated = calculateAverages(data.courses);
                setCourses(calculated[0]);
                setDegreeAvg(calculated[1]);
                setYearAvgs(calculated[2]);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    useEffect(()=> {
        getCourses();
    }, [])

    if(isLoading) {
        return <Spinner/>;
    }
    
    return (
        <main>
            <div className='avgRow light-background'>
                <Typography variant='h6'>
                    Degree Average: {degreeAvg}
                </Typography>
            </div>
            <YearSlider year={year} yearAvgs={yearAvgs} plusYear={plusYear} minusYear={minusYear}/>
            <div className='courses'>
            {courses.filter((semesters) => semesters._id.year === year && semester === semesters._id.semester).length ? "" : 
            <>
                <SemesterSlider semester={semester} plusSemester={plusSemester} minusSemester={minusSemester} avg={0}/>
            </>}
            {courses.filter((semesters) => semesters._id.year === year && semester === semesters._id.semester).map((course) => {
                return <>
                <SemesterSlider semester={semester} plusSemester={plusSemester} minusSemester={minusSemester} avg={course._id.avg}/>
                {course.courses.map((c) => {
                    return (
                        <Accordion sx={{width: "100%"}} key={c._id} expanded={expanded === c._id || expanded === "all"} onChange={handleExpand(c._id)}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            >
                            {edit !== c._id ? <CourseSummaryView course={c} select={simulationSelect} toggleCourse={toggleSelectCourse} /> : <CourseSummaryForm form={form} changeForm={changeForm}/>}
                            </AccordionSummary>
                            <AccordionDetails sx={{paddingLeft: "0", paddingRight: "0"}}>
                            <Divider orientation='horizontal'/>
                            <div style={{width: "100%"}}>
                                {edit !== c._id ?
                                c.assignments.map(ass => {
                                    return (
                                        <AssignmentView assignment={ass} key={ass._id} select={simulationSelect} toggleCourseAssignment={toggleCourseAssignment}  />
                                    )
                                }) : form.assignments.map((ass, index) => {
                                    return (
                                        <AssignmentForm assignment={ass} index={index} changeAssignments={changeAssignments} deleteAssignment={deleteAssignment}/>
                                    )
                                })}
                            </div>
                            {edit === c._id ? <IconButton onClick={newAssignment}>
                                                <AddIcon sx={{color: "green"}}/>
                                            </IconButton> : <></>}
                            {simulationSelect ? <></> : edit === c._id ? <div className='space' style={{padding: "1rem 1rem"}}>
                                <Button variant="contained" color="error" onClick={() => deleteCourse(c._id)}>
                                    Delete
                                </Button>
                                <Button variant="contained" color="primary" id='btn-primary' onClick={() => updateCourse(c._id)}>
                                    Save
                                </Button>
                            </div> : <div className='edit-container'>
                                    <Button variant="contained" color="primary" id='btn-primary' onClick={() => {editCourse(c)}}>
                                        Edit
                                    </Button>
                                </div>}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
                    </>
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
                                <Button variant="contained" color="error" onClick={removeNewCourse}>
                                    Delete
                                </Button>
                                <Button variant="contained" color="primary" id='btn-primary' onClick={createCourse}>
                                    Save
                                </Button>
                            </div>
                            </AccordionDetails>
                        </Accordion>
            </> : <></>}
            <Button sx={{width: "fit-content", margin: "0.7rem 0"}} onClick={openNewCourse}>
                New Course
            </Button>
            </div>
            <Fab sx={{position: "absolute"}} className='sim-btn' color="primary" aria-label="simulation" onClick={selectSimulation}>
                {simulationSelect ? <CloseIcon /> : <CallMissedOutgoingIcon />}
            </Fab>
        </main>
    );
}

export default Home;

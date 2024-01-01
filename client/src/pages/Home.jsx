import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import Spinner from '../components/Spinner';
import { calculateAverages } from '../utils/generalFunctions';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import SummarizeIcon from '@mui/icons-material/Summarize';
import CheckIcon from '@mui/icons-material/Check';
import Main from '../components/Main';
import HomeIcon from '@mui/icons-material/Home';
import Simulation from '../components/Simulation';
import Summary from '../components/Summary';


function Home({ isAuthenticated, setTitle}) {

    const { t }= useTranslation('translation', { keyPrefix: 'Home' });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [year, setYear] = useState(1);
    const [semester, setSemester] = useState(1);
    const [yearAvgs, setYearAvgs] = useState([]);
    const [degreeAvg, setDegreeAvg] = useState(0);
    const [simulation, setSimulation] = useState(false);
    const [simulationData, setSimulationData] = useState({
        ids: [],
        courses: [],
    });
    const [nav, setNav] = useState(false);
    const [tab, setTab] = useState("main");
    const cookies = new Cookies();

    useEffect(()=> {
        if(!isAuthenticated) {
            navigate('/login');
        }

    }, [isAuthenticated, navigate])

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

    const createCourse = async (form, setExpanded, setNewCourse) => {
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
                if(data.specialMessage) {
                    toast.info(data.specialMessage);
                }
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
                    setTitle(`${t('degreeAvg')}: ${calculated[1]}`);
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
                    setTitle(`${t('degreeAvg')}: ${calculated[1]}`);
                    setYearAvgs(calculated[2]);
                }
                setExpanded(false);
                setNewCourse(false);
                toast.success(t('courseAdded'));
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const updateCourse = async (id, form, setEdit, setExpanded) => {
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
                setTitle(`${t('degreeAvg')}: ${calculated[1]}`);
                setYearAvgs(calculated[2]);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const deleteCourse = async (id, setEdit, setExpanded) => {
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
                setTitle(`${t('degreeAvg')}: ${calculated[1]}`);
                setYearAvgs(calculated[2]);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
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
                if(data.specialMessage) {
                    toast.info(data.specialMessage);
                }
                let calculated = calculateAverages(data.courses);
                setCourses(calculated[0]);
                setDegreeAvg(calculated[1]);
                setYearAvgs(calculated[2]);
                setTitle(`${t('degreeAvg')}: ${calculated[1]}`)
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error')
        }
    }

    const selectSimulation = () => {
        setNav(false);
        if(simulation) {
            setSimulation(false);
            return;
        }
        setSimulationData({
            ids: [],
            courses: [],
        });
        setSimulation(true);
    }

    const simulationTab = () => {
        setNav(false);
        setTab("simulation");
    }

    const summaryTab = () => {
        setNav(false);
        setTab("summary");
    }

    const mainTab = () => {
        setNav(false);
        setTab("main");
        if(simulation) {
            setSimulation(false);
        }
    }

    useEffect(()=> {
        if(isAuthenticated)
            getCourses();
    }, [isAuthenticated]);

    if(isLoading) {
        return <Spinner/>;
    }

    const mainButtons = [{name: t("simulation"), onClick: selectSimulation, icon: <CallMissedOutgoingIcon/>},
    {name: t("summary"), onClick: summaryTab, icon: <SummarizeIcon/>}];

    const simulationSelectButtons = [{name: t("cancel"), onClick: selectSimulation, icon: <CloseIcon/>},
    {name: t("next"), onClick: simulationTab, icon: <CheckIcon/>}]

    const subTabButtons = [{name: t("back"), onClick: mainTab, icon: <HomeIcon />}]
    
    return (
        <main>
            safasfasf
            {tab === 'main' ? <Main courses={courses} year={year} semester={semester} simulationData={simulationData} setSimulationData={setSimulationData}
            plusSemester={plusSemester} plusYear={plusYear} minusSemester={minusSemester} minusYear={minusYear} simulation={simulation} setSimulation={setSimulation}
            yearAvgs={yearAvgs} degreeAvg={degreeAvg} deleteCourse={deleteCourse} updateCourse={updateCourse} createCourse={createCourse} /> : 
            tab === 'simulation' ? <Simulation courses={courses} simulationData={simulationData} setSimulationData={setSimulationData}
            yearAvgs={yearAvgs} degreeAvg={degreeAvg} setDegreeAvg={setDegreeAvg} setYearAvgs={setYearAvgs}/>
            : <Summary courses={courses} yearsAvg={yearAvgs} degreeAvg={degreeAvg}/>}
            <SpeedDial
                ariaLabel="navigation"
                sx={{ position: 'sticky', bottom: 16, marginLeft: "auto", marginRight: "1rem", marginTop: "auto" }}
                icon={<SpeedDialIcon />}
                onClose={() => setNav(false)}
                onOpen={() => setNav(true)}
                open={nav}>
                    {tab=== 'main' ? simulation ?
                    simulationSelectButtons.map(btn => {
                        return (
                            <SpeedDialAction
                            key={btn.name}
                            icon={btn.icon}
                            tooltipTitle={btn.name}
                            onClick={btn.onClick}
                        />
                        )
                    }): mainButtons.map(btn => {
                    return (
                        <SpeedDialAction
                        icon={btn.icon}
                        key={btn.name}
                        tooltipTitle={btn.name}
                        onClick={btn.onClick}
                    />
                    )}) : tab === 'simulation' ? subTabButtons.map(btn => {
                        return (
                            <SpeedDialAction
                            icon={btn.icon}
                            key={btn.name}
                            tooltipTitle={btn.name}
                            onClick={btn.onClick}
                        />
                        )}) : subTabButtons.map(btn => {
                            return (
                                <SpeedDialAction
                                icon={btn.icon}
                                key={btn.name}
                                tooltipTitle={btn.name}
                                onClick={btn.onClick}
                            />
                        )})}
      </SpeedDial>
        </main>
    );
}

export default Home;

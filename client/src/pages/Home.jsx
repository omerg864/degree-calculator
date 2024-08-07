import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
import Cookies from 'universal-cookie';


function Home({ setDegreeAvg, degreeAvg}) {

    const { t }= useTranslation('translation', { keyPrefix: 'Home' });
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [year, setYear] = useState(1);
    const [semester, setSemester] = useState(1);
    const [yearAvgs, setYearAvgs] = useState([]);
    const [plus, setPlus] = useState(true);
    const [simulation, setSimulation] = useState(false);
    const [simulationData, setSimulationData] = useState({
        ids: [],
        courses: [],
    });
    const [nav, setNav] = useState(false);
    const [tab, setTab] = useState("main");
    const cookie = new Cookies();

    const plusYear = () => {
        setPlus(true);
        setYear(year + 1);
    }

    const minusYear = () => {
        setPlus(false);
        setYear(year - 1);
    }

    const plusSemester = () => {
        setPlus(true);
        setSemester(semester + 1);
    }

    const minusSemester = () => {
        setPlus(false);
        setSemester(semester - 1);
    }

    const createCourse = async (form, setExpanded, setNewCourse) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/course/`, { headers: {
                authorization: `Bearer ${cookie.get('userToken')}`,
                "Content-type": "application/json",
            }, credentials: 'include' ,method: 'POST', body: JSON.stringify({...form, semester, year})});
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
                toast.success(t('courseAdded'));
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error');
            console.log(err);
        }
    }

    const updateCourse = async (id, form, setEdit, setExpanded) => {
        setEdit(false);
        setExpanded(false);
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/course/${id}`, { headers: {
                authorization: `Bearer ${cookie.get('userToken')}`,
                "Content-type": "application/json",
                withCredentials: true,
            }, credentials: 'include' ,method: 'PUT', body: JSON.stringify(form) })
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
            toast.error('Internal Server Error');
            console.log(err);
        }
    }

    const deleteCourse = async (id, setEdit, setExpanded) => {
        setEdit(false);
        setExpanded(false);
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/course/${id}`, { headers: {
                authorization: `Bearer ${cookie.get('userToken')}`,
                "Content-type": "application/json",
                withCredentials: true,
            }, credentials: 'include' ,method: 'DELETE'})
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
            toast.error('Internal Server Error');
            console.log(err);
        }
    }

    const getCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/course/`, { headers: {
                authorization: `Bearer ${cookie.get('userToken')}`,
                "Content-type": "application/json",
                withCredentials: true
            }, credentials: 'include' ,method: 'GET'})
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
            }
            setIsLoading(false);
        } catch (err) {
            toast.error('Internal Server Error');
            console.log(err);
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
        getCourses();
    }, []);

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
            {tab === 'main' ? <Main plus={plus} courses={courses} year={year} semester={semester} simulationData={simulationData} setSimulationData={setSimulationData}
            plusSemester={plusSemester} plusYear={plusYear} minusSemester={minusSemester} minusYear={minusYear} simulation={simulation} setSimulation={setSimulation}
            yearAvgs={yearAvgs} degreeAvg={degreeAvg} deleteCourse={deleteCourse} updateCourse={updateCourse} createCourse={createCourse} /> : 
            tab === 'simulation' ? <Simulation courses={courses} simulationData={simulationData} setSimulationData={setSimulationData}
            yearAvgs={yearAvgs} degreeAvg={degreeAvg} setDegreeAvg={setDegreeAvg} setYearAvgs={setYearAvgs}/>
            : <Summary courses={courses} yearsAvg={yearAvgs} degreeAvg={degreeAvg}/>}
            <SpeedDial
                ariaLabel="navigation"
                sx={{ position: 'fixed', right: 0, bottom: 16, marginLeft: "auto", marginRight: "1rem", marginTop: "auto" }}
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

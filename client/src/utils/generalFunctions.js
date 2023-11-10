export const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const calculateCourse = (assignments) => {
    let grade = 0;
    for(let i=0; i< assignments.length; i++) {
        if(assignments[i].grade) {
            let gradeTemp = assignments[i].grade *  assignments[i].percent / 100;
            if(gradeTemp > 100) {
                gradeTemp = 100;
            }
            if(gradeTemp < 0) {
                gradeTemp = 0
            }
            grade += gradeTemp;
        }
    }
    return grade.toFixed(0);
}


export const calculateSemesterAvg = (courses) => {
    let sumPoints = 0, total = 0, binaryPass = 0, completedCourses = 0, sumAllPoints = 0;
    for(let i= 0; i < courses.length; i++) {
        sumAllPoints += courses[i].points;
        if(courses[i].binaryPass) {
            binaryPass++;
            continue;
        }
        if(courses[i].assignments.length && !courses[i].grade) {
            sumPoints += courses[i].points;
            let grade = calculateCourse(courses[i].assignments);
            if(grade >= 60) {
                completedCourses++;
            }
            total += courses[i].points * grade;
        } else {
            if (courses[i].grade) {
                sumPoints += courses[i].points;
                if(courses[i].grade >= 60) {
                    completedCourses++;
                }
                total += courses[i].points * courses[i].grade;
            }
        }
    }
    return [total, sumPoints, completedCourses, binaryPass, sumAllPoints];
}


export const calculateAverages = (courses) => {
    let yearsSum = [];
    let yearsPoints = [];
    for(let i=0; i < courses.length; i++) {
        let avgData = calculateSemesterAvg(courses[i].courses);
        courses[i]._id.sum = avgData[0];
        courses[i]._id.points = avgData[1];
        courses[i]._id.avg = (avgData[0] / avgData[1]).toFixed(2);
        courses[i]._id.completedCourses = avgData[2];
        courses[i]._id.binaryPass = avgData[3];
        courses[i]._id.OngoingCourses = courses[i].courses.length - courses[i]._id.completedCourses - courses[i]._id.binaryPass;
        courses[i]._id.sumAllPoints = avgData[4];
        if(yearsSum[courses[i]._id.year - 1]) {
            yearsSum[courses[i]._id.year - 1] +=  avgData[0];
        } else {
            yearsSum[courses[i]._id.year - 1] = avgData[0];
        }
        if(yearsPoints[courses[i]._id.year - 1]) {
            yearsPoints[courses[i]._id.year - 1] +=  avgData[1];
        } else {
            yearsPoints[courses[i]._id.year - 1] = avgData[1];
        }
    }
    let yearsAvg = [];
    let degreePoints = 0;
    let degreeAvg = 0;
    for(let i = 0; i <yearsSum.length;i++) {
        yearsAvg[i] = (yearsSum[i] / yearsPoints[i]).toFixed(2);
        degreeAvg += yearsSum[i];
        degreePoints += yearsPoints[i];
    }
    return [courses, (degreePoints ? degreeAvg / degreePoints : 0).toFixed(2), yearsAvg];
}


export const arrayIncludes = (arr1, arr2) => {
    for(let i = 0; i < arr1.length; i++) {
        if(arr2.includes(arr1[i])) {
            return true;
        }
    }
    return false;
}

export const deepCopyCourses = (courses) => {
    let coursesCopy = [];
    for(let i = 0; i < courses.length; i++) {
        let semester = {...courses[i]};
        semester.courses = semester.courses.map(course => {
            return {...course, assignments: [...course.assignments.map(assignment => { return {...assignment}})]};
        });
        semester._id = {...semester._id};
        coursesCopy.push(semester);
    }
    return coursesCopy;
}

export const difference = (original, temp) => {
    original = parseFloat(original);
    temp = parseFloat(temp);
    let color;
    if(original > temp) {
        color = "red";
    } else if(original < temp) {
        color = "green";
    } else {
        color = "black";
    }
    let diff = Math.abs(original - temp).toFixed(2);
    return {color, diff};
}
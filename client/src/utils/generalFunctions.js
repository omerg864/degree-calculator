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
    let sumPoints = 0, total = 0;
    for(let i= 0; i < courses.length; i++) {
        if(courses[i].assignments.length) {
            sumPoints += courses[i].points;
            total += courses[i].points * calculateCourse(courses[i].assignments);
        } else {
            if (courses[i].grade) {
                sumPoints += courses[i].points;
                total += courses[i].points * courses[i].grade;
            }
        }
    }
    return [total, sumPoints];
}


export const calculateAverages = (courses) => {
    let yearsSum = [];
    let yearsPoints = [];
    for(let i=0; i < courses.length; i++) {
        let avgData = calculateSemesterAvg(courses[i].courses);
        courses[i]._id.sum = avgData[0];
        courses[i]._id.points = avgData[1];
        courses[i]._id.avg = (avgData[0] / avgData[1]).toFixed(2);
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
    return [courses, (degreeAvg / degreePoints).toFixed(2), yearsAvg];
}

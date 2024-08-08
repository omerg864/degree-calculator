import React, { useEffect } from 'react'

function NumberCounter({ from, to}) {

    const [count, setCount] = React.useState(from);
    const [isCounting, setIsCounting] = React.useState(true);
    const [isIncreasing, setIsIncreasing] = React.useState(true);

    React.useEffect(() => {
        if (isCounting) {
            if (count === parseInt(to)) {
                setIsCounting(false);
                setCount(to);
            } else {
                setTimeout(() => {
                    if (isIncreasing) {
                        setCount(count + 1);
                    } else {
                        setCount(count - 1);
                    }
                }, 6);
            }
        }
    }, [count, isCounting, isIncreasing, to]);

    React.useEffect(() => {
        setCount(from);
        setIsCounting(true);
        if (from > to) {
            setIsIncreasing(false);
        }
    }, [from, to]);


  return (
    <span>
        {count}
    </span>
  )
}

export default NumberCounter
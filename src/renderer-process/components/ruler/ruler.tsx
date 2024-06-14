import './ruler.css';

function Ruler({ className }) {
    return (
        <ol className={`ruler ${className}`}>
            <li data-mm="0.0mm"></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li data-mm="4.0mm"></li>
        </ol>
    );
}

export default Ruler;

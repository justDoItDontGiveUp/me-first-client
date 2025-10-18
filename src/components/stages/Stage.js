
export function Stage({ stageNum, stageStat, stageName }) {

    return (
        <>
            <div className="frame-65">
                <div className="nudetails" title="stage number">{stageNum}</div>
                <div className="nudetails" title="stage name">{stageName}</div>
                <div className="nudetails" title="stage status">{stageStat}</div>
            </div>
        </>
    );
}
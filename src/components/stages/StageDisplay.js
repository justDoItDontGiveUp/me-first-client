import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleDocViewer } from '../documents/GoogleDocViewer'
import { Modal } from "../Modal";
import { Products } from "../products/Products";
import { Product } from "../products/Product";
import { UploadFile } from '../documents/UploadFile'
import { AddDocument } from "../documents/AddDocument";
import { Select_products } from "../products/Select_products";
import { Project_products } from "../products/Project_products";
import '../../css/StageDisplay.css';

export function StageDisplay({ username, projectId, stageId }) {
    const [stage, setStage] = useState();
    const [projectProducts, setProjectProducts] = useState();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState();

    useEffect(() => {
        if (username && stageId) {
            fetchStage();
            fetchUserId();
        }
    }, [username, stageId]);

    const fetchUserId = async () => {
        try {
            console.log('in fetchUser');
            const res = await fetch(`http://localhost:3333/${username}/users/userId/${username}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error("Failed to fetch username");
            const data = await res.json();
            setUserId(data.user_id);
            console.log('user_id from StageDisplay:', userId);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }


    const fetchStage = async () => {
        try {
            console.log('in fetchStage');
            const res = await fetch(`http://localhost:3333/${username}/stages/display/${stageId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error("Failed to fetch stage");
            const data = await res.json();
            setStage(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const fetchProjectProducts = async () => {
        try {
            //גם פה פונים לטבלת קשר בין פרוייקטים ומוצרים
            const res = await fetch(`http://localhost:3333/${username}/${stageId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Failed to fetch stage");
            const data = await res.json();
            setProjectProducts(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }
    const toggleCompleted = async () => {
  try {
    const updatedCompleted = !stage.completed;
    const updatedCompletionDate = updatedCompleted ? new Date().toISOString() : null;

    const res = await fetch(`http://localhost:3333/${username}/stages/completed/${stageId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: updatedCompleted,
        completion_date: updatedCompletionDate,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update stage');
    }

     // במקום לעדכן את stage חלקית, נטען אותו מחדש מהשרת בשלמותו
    await fetchStage();
  } catch (error) {
    console.error('Error toggling completed:', error);
    alert('Error updating stage status.');
  }
//     const updatedStage = await res.json();
//     setStage(updatedStage);
//   } catch (error) {
//     console.error('Error toggling completed:', error);
//     alert('Error updating stage status.');
//   }
};


    const choosePresentation = () => {
        console.log('in choosePresentation');
        console.log('stage number:' + stage.stage_number);
        switch (stage.stage_number) {
            case 1:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'9CheckList'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 2:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'RFQ'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 3:
                return (
                    <div onClose={fetchProjectProducts}>
                        <Select_products fromProject={true} />
                    </div>
                );
            case 4:
                return (
                    <div onClose={fetchProjectProducts}>
                        <Project_products fromProject={true} />
                    </div>
                );
            case 5:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'LOI'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 6:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'FCO'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 7:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'SPA'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 8:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'ICPO'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
            case 9:
                return (
                    <GoogleDocViewer
                        projectId={projectId}
                        docType={'CIF'}
                        stageId={stageId}
                        token={token}
                        username={username}
                        user_id={userId}
                    />
                );
        }
    }
    return (
        <>
{stage && userId ? choosePresentation() : <div>Loading stage data...</div>}
            {stage && (
              <div className="stage-controls">
                <button
                  onClick={toggleCompleted}
                  className={`stage-completed-button ${stage.completed ? 'completed' : ''}`}
                >
                  {stage.completed ? 'unComplete' : '✔ Completed'}
                </button>
                {stage.completed && stage.completion_date && (
                  <span className="stage-completed-date">
                    Completed at: {new Date(stage.completion_date).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
)}
        </>
    );

}
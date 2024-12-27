import React, { Component } from "react";
import { Card, Button, Table, message, Divider } from "antd";

import{
    getAllCriteriaValueByQuestion,
    addCriteriaValue,
    editCriteriaValue,
    deleteCriteriavalue,
} from "@/api/criteriaValue";
import { getAnswers } from "@/api/answer";
import {getLectures} from "@/api/lecture";
import { getTeamTeachings } from "@/api/teamTeaching";
import { getLinguisticValues } from "@/api/linguisticValue";
import { getQuestionsByRPS } from "../../api/question";

import TypingCard from "@/components/TypingCard";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import AddCriteriaValueForm from "./form/add-criteria-value-form";
import answer from "../answer";
import {reqUserInfo,getUserById} from "@/api/user";

const { Column } = Table;

class CriteriaIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            criteriaValues: [],
            questions: [],
            linguisticValues: [],
            teamTeachings: [],
            lectures: [],
            userInfo: [],
            userjson: [], // Initialize userjson in state
            userIdJson: "", 
            answers: [],
            linguisticValue: [],
            editCriteriaValueModalVisible: false,
            editCriteriaValueModalLoading: false,
            currentRowData: {},
            addCriteriaValueModalVisible: false,
            addCriteriaValueModalLoading: false,
            questionID: "",
            userID:""
        };
    }

    // Usage to get baseed on id question
    getCriteriaValues = async (questionID) => {
        const result = await getAllCriteriaValueByQuestion(questionID);
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
            const userIdJson = this.state.userIdJson; // Retrieve userIdJson from the state
            const filteredContent = content.filter(item => item.user === userIdJson); // Filter the content based on userIdJson
            this.setState({
                criteriaValues: filteredContent, // Set the filtered content to the state
                selectedQuestionID: questionID, // Add this line
            });
        }
    };

    // getCriteriaValues = async (questionID) => {
    //     try {
    //         const result = await getAllCriteriaValueByQuestion(questionID);
    //         const { content, statusCode } = result.data;
    
    //         console.log("Fetched content:", content); // Log the fetched content
    
    //         if (statusCode === 200) {
    //             const filteredContent = content.filter(item => item.userId === this.state.userIdJson); // Filter the content based on the userIdJson
    
    //             console.log("Filtered content:", filteredContent); // Log the filtered content
    
    //                 this.setState({
    //                     criteriaValues: filteredContent,
    //                     selectedQuestionID: questionID,
    //                     userIdJson: filteredContent[0].id, // Set userIdJson to the id of the first filtered item
    //                 });
                
    //         } else {
    //             console.error("Failed to fetch data, status code:", statusCode);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching criteria values:", error);
    //     }
    // };

    handleDeleteCriteriaValue = (row) => {
        const { id } = row;
        if (id === "admin") {
            message.error("Cannot delete admin");
            return;
        }
        this.setState({ deleting: true }); // Assuming there's a state variable 'deleting'
        deleteCriteriavalue({ id })
            .then((res) => {
                message.success("Berhasil dihapus");
                this.getCriteriaValues(this.state.questionID); // Refresh the criteria values
            })
            .catch((error) => {
                message.error("Delete operation failed");
                if (error.response) {
                    // If the error has a response property, log it for more details
                    console.error("Error response:", error.response);
                } else {
                    console.error(error); // Log the generic error if no response is attached
                }
            })
            .finally(() => {
                this.setState({ deleting: false }); // Reset the deleting state
            });
    };

    
getUserInfo = async () => {
    const result = await reqUserInfo();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
        this.setState({
            userId: content.id,
            userInfo: content,
        });
    }
};

getUserInfoJson = async (userId) => {
    const result = await getUserById(userId);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
        this.setState({
            userIdJson: content[0].id,
            userInfoJson: content,
        });
    }
};

    
    
    getLectures = async () => {
        const result = await getLectures();
        const {content, statusCode} = result.data;
        if (statusCode === 200) {
            this.setState({
                lectures: content,
            });
        }
    };
    getQuestions = async () => {
        const result = await getQuestionsByRPS("RPS-PBO-001");
        const { content, statusCode } = result.data;
    
        if (statusCode === 200) {
            // Assuming this.props.match.params.questionID is available and contains the ID of the question you're looking for
            const questionID = this.props.match.params.questionID;
            const question = content.find(q => q.id === questionID);
            if (question) {
                console.log('Question Title:', question.title); // Here you have the title of the matching question
                // You can now set this to your component's state or use it as needed
                this.setState({
                    questions: content,
                    selectedQuestionTitle: question.title, // Assuming you want to store the selected question's title
                });
            } else {
                console.log('Question not found');
                this.setState({
                    questions: content,
                    selectedQuestionTitle: '', // Reset or handle the case where the question is not found
                });
            }
        }
    };
    getAnswers = async (questionID) => {
        const result = await getAnswers(questionID);
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
          this.setState({
            answers: content,
            answerTitle: content[0].title,
            answerTitle1: content[1].title,
            answerTitle2: content[2].title,
            answerTitle3: content[3].title,
        });
        }
      };
    
    getLinguisticValues = async () => {
        const result = await getLinguisticValues();
        const { content, statusCode } = result.data;
        if (statusCode === 200) {
            this.setState({
                linguisticValues: content,
            });
        }
    };
    handleAddCriteriaValue = () => {
        this.setState({
            addCriteriaValueModalVisible: true,
        });
    };

    handleCancel = () => {
        this.setState({
          addCriteriaValueModalVisible: false,
        });
      };
    
    
    handleAddCriteriaValueOk = () => {
        const { form } = this.addCriteriaValueFormRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({ addCriteriaValueModalLoading: true });
            const questionId = this.state.selectedQuestionID; // Get the questionId from the state
            const userId = this.state.userId;
                values.userId = userId; // This line adds the userId to the values object

            addCriteriaValue(values, questionId) // Pass the questionId to addCriteriaValue
                .then((response) => {
                    form.resetFields();
                    this.setState({
                        addCriteriaValueModalVisible: false,
                        addCriteriaValueModalLoading: false,
                    });
                    message.success("Berhasil menambahkan Criteria Value!");
                    this.getCriteriaValues(questionId); // Refresh the criteria values
                })
                .catch((e) => {
                    console.error(e.response.data);
                    message.error("Gagal menambahkan Criteria Value!");
                });
        });
    };

    async componentDidMount() {
        const questionID = this.props.match.params.questionID;
        this.setState({ questionID });
    
        const userInfoResponse = await reqUserInfo();
        const { content: userInfoContent, statusCode: userInfoStatusCode } = userInfoResponse.data;
        const { id: userId, roles: userRole } = userInfoResponse.data;

    
        await this.getUserInfoJson(userId);
        this.getQuestions();
        this.getLinguisticValues();
        this.getAnswers(questionID);
        this.getCriteriaValues(questionID);
    }


    render(){
        
        const { criteriaValues, userInfoJson,linguisticValues,answerTitle,answerTitle1,answerTitle2,answerTitle3,selectedQuestionTitle,userIdJson } = this.state;
        const userID = this.state?.userInfo?.id ?? '';
        const title =(
            <span>
                <Button type="primary" onClick={this.handleAddCriteriaValue}>
                    Berikan Nilai ke soal
                </Button>
            </span>
        );
        const { selectedQuestionID } = this.state;
        const cardContent = `Di sini, Anda dapat menilai pertanyaan di sistem, lalu memberinya nilai masing masing kriteria.`;
        const criteriaNames = [
            "Nama",
            "Evaluation",
            "Synthesis",
            "Comprehension",
            "Analysis",
            "Difficulty",
            "Reliability",
            "Discrimination",
            "Application",
            "Knowledge"
        ];
        const averages = criteriaValues.reduce((acc, curr) => {
            for (let i = 1; i <= 9; i++) {
              const key = `value${i}`;
              if (curr[key] && 'average' in curr[key]) {
                if (!acc[key]) {
                  acc[key] = {
                    sum: 0,
                    count: 0,
                  };
                }
                acc[key].sum += parseFloat(curr[key].average);
                acc[key].count += 1;
              }
            }
            return acc;
          }, {});
          
          // Calculate the average for each value
          for (let i = 1; i <= 9; i++) {
            const key = `value${i}`;
            if (averages[key]) {
              averages[key] = (averages[key].sum / averages[key].count).toFixed(4);
            }
          }
          

        const columns = [
            
        ];
    
        for (let i = 1; i <= 9; i++) {
            columns.push(
                <Column
                title={`Nilai Kriteria ${criteriaNames[i]}`}
                dataIndex={`value${i}.name`}
                    key={`value${i}.name`}
                    align="center"
                />
            );
        }

        const columns2 = [];

        for (let i = 1; i <= 9; i++) {
            columns2.push(
                <Column
                    title={`Nilai Kriteria ${criteriaNames[i]}`}
                    dataIndex={`value${i}.average`} // Corrected typo here
                    key={`value${i}.average`} // Corrected typo here as well
                    align="center"
                />
            );
        }
        

        console.log(criteriaValues);
        return(
            <div>

                <TypingCard title={title} source={cardContent} />

                <Card title={''}>  
                <h3>{` Soal: ${selectedQuestionTitle}`}</h3>
                <h3>
                List Jawaban:
                <div>{` ${answerTitle}`}</div>
                <div>{`${answerTitle1}`}</div>
                <div>{`${answerTitle2}`}</div>
                <div>{`${answerTitle3}`}</div>
                </h3>

                    <Table dataSource={criteriaValues} rowKey="id">
                    
                    {columns}
                    <Column
                    title="Operasi"
                    key="action"
                    width={195}
                    align="center"
                    render={(text, row) => (
                        <span>
                        <Divider type="vertical" />
                        <Button
                            type="primary"
                            shape="circle"
                            icon="delete"
                            title="menghapus"
                            onClick={() => this.handleDeleteCriteriaValue(row)}                        />
                        </span>
                    )}
                    />
                    </Table>
                </Card>
                <h3>{`Nilai dalam bentuk numerik`}</h3>

                {/* <Table dataSource={criteriaValues} rowKey="id">
                    {columns2}
                </Table>
                <table>
                    <thead>
                    <tr>
                        {criteriaNames.slice(1).map((name, i) => (
                        <th key={i + 1} style={{border: '1px solid #ddd', padding: '8px'}}>
                            {"Average Value "+name}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {Array.from({ length: 9 }, (_, i) => (
                        <td key={i} style={{border: '1px solid #ddd', padding: '8px'}}>
                            {averages[`value${i + 1}`]}
                        </td>
                        ))}
                    </tr>
                    </tbody>
                </table> */}

                <AddCriteriaValueForm
                wrappedComponentRef={(formRef) => (this.addCriteriaValueFormRef = formRef)}
                visible={this.state.addCriteriaValueModalVisible}
                confirmLoading={this.state.addCriteriaValueModalLoading}
                onCancel={this.handleCancel}
                onOk={this.handleAddCriteriaValueOk}
                linguisticValues={linguisticValues}
                questionID={this.state.questionID}
                userID={this.state.userIdJson} // Use userIdJson here
                />
            </div>

        )

    }


    
}


export default withRouter(CriteriaIndex);
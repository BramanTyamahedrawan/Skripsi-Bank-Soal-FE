import React, { Component } from "react";
import { Select } from 'antd';
import { Card,  Table } from "antd";
import TypingCard from "@/components/TypingCard";

import { getQuiz } from "@/api/quiz";
import { getRPS } from "@/api/rps";
import {reqUserInfo} from "@/api/user";

const { Column } = Table;
class ListTodoAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rps:[],
            quiz:[],
            userInfo:[],
            quizMessages: [],
            lecturerColumns: [],

            selectedQuiz: '', 
        };
    }
    getQuiz = async () => {
        const result = await getQuiz();
        const { content, statusCode } = result.data;
        console.log(result.data);
        if (statusCode === 200) {
          this.setState({
            quiz: content,
          });
        }
      };

        getRps = async () => {
            const result = await getRPS();
            const { content, statusCode } = result.data;
        
            if (statusCode === 200) {
            this.setState({
                rps: content,
            });
            }
        };

        getUserInfo = async () => {
            const result = await reqUserInfo();
            const { content, statusCode } = result.data;
        
            if (statusCode === 200) {
            this.setState({
                userInfo: content,
            });
            }
        };

        componentDidMount() {
            this.getQuiz();
            this.getRps();
            this.getUserInfo();
            this.fetchData();

        }
        
        // Add a new function to select a quiz
        selectQuiz = (quizName) => {
            this.setState({ selectedQuiz: quizName }, this.fetchData);
            // fetchData is called as a callback to setState, so it's called after the state is updated
        };
        
        fetchData = async () => {
            try {
                const quizResponse = await getQuiz();
                const { content: quizContent, statusCode: quizStatusCode } = quizResponse.data;
        
                const userInfoResponse = await reqUserInfo();
                const { content: userInfoContent, statusCode: userInfoStatusCode } = userInfoResponse.data;
        
                const rpsResponse = await getRPS();
                const { content: rpsContent, statusCode: rpsStatusCode } = rpsResponse.data;
        
                let devLecturerIds = [];

                if (quizStatusCode === 200 && rpsStatusCode === 200) {
                  quizContent.forEach(quiz => {
                    const matchingRPS = rpsContent.find(rps => rps.id === quiz.rps.id);
                    if (matchingRPS) {
                      devLecturerIds = matchingRPS.dev_lecturers.map(lecturer => lecturer.id);
                      console.log(`Dev Lecturer IDs for quiz ${quiz.id}:`, devLecturerIds);
                    } else {
                      console.log(`No matching RPS found for quiz ${quiz.id}`);
                    }
                  });
                } 
            
                // Get the user's role and id from the userInfoResponse
                const { id: userId, roles: userRole } = userInfoResponse.data;
                    
                if (quizStatusCode === 200 ) {
                    // Find the maximum number of lecturers in any rps
                    const maxLecturers = Math.max(...rpsContent.map(rps => rps.dev_lecturers ? rps.dev_lecturers.length : 0));                
                    // Create an array of lecturer columns
                    const lecturerColumns = Array.from({ length: maxLecturers }, (_, i) => ({
                        title: `Lecturer ${i + 1}`,
                        dataIndex: `lecturer${i + 1}`,
                        key: `lecturer${i + 1}`,
                        align: "center",
                    }));
                
                    this.setState({
                        quizMessages: quizContent
                            .filter(item => item.name === this.state.selectedQuiz && rpsContent.some(rps => rps.id === item.rps.id))
                            .map(item => {
                                const rps = rpsContent.find(rps => rps.id === item.rps.id);
                                const message = {
                                    message: item.message,
                                    quiz: item.name,
                                    rpsName: rps ? rps.name : '',
                                };
                
                                // Add each lecturer to a separate field in the message
                                rps.dev_lecturers.forEach((lecturer, i) => {
                                    message[`lecturer${i + 1}`] = lecturer.name;
                                });
                
                                return message;
                            }),
                        lecturerColumns: lecturerColumns || [], // ensure that lecturerColumns is always an array
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        render() {
            const { quiz, quizMessages, rps } = this.state;
            const title = (
                <span>
                    Monitor List Todo Dosen untuk Admin 
                </span>
              );

            const cardContent = `Di sini, Anda sebagai admin dapat mengetahui progres yang dilakukan dosen untuk persiapan membuat ujian`;
            return (
            <div className="app-container">
                <TypingCard title="Manajemen Kuis" source={cardContent} />
                <br />
                <Card title={title}>
                    {/* Add a dropdown to select a quiz */}
                    <Select onChange={this.selectQuiz} style={{ width: 200, marginBottom: 20 }}>
                    {quiz.map((quizItem, index) => (
                        <Select.Option key={index} value={quizItem.name}>
                        {quizItem.name}
                        </Select.Option>
                    ))}
                    </Select>
                <Table bordered rowKey={(record, index) => index} dataSource={quizMessages} pagination={false}>
                {this.state.lecturerColumns.map((column, index) => (
                        <Column
                            title={column.title}
                            dataIndex={column.dataIndex}
                            key={column.key}
                            align="center"
                            render={(text, record) => (
                                <div>
                                    {text} {/* This will render the lecturer's name */}
                                    <div style={{ color: 'red' }}>
                                        Not Completed
                                    </div>
                                </div>
                            )}
                        />
                    ))}                  
                    <Column title="Quiz Name" dataIndex="quiz" key="rpsName" align="center" />
                    <Column
                    title="status"
                    dataIndex=""
                    key=""
                    align="center"
                    render={(text, record) => (
                        <div style={{ color: 'red' }}>
                        Not Completed
                        </div>
                    )}
                    />               
                     </Table>
                </Card>
            </div>
            );

          }

}

export default ListTodoAdmin;

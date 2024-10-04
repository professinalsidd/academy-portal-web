import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CardComp from "../../../components/common/Card/Card";
import TableComp from "../../../components/common/Table/Table";
import WrapperComp from "../../../components/common/Wrapper";
import {
  resultTableColumnsForAdmin,
  resultTableColumnsForStudent,
} from "../../../db";
import useResponsive from "../../../themes/themes";
import { useSelector } from "react-redux";
import { AllStudentsAPI } from "../../../services/apis/allStudents";
import InputComp from "../../../components/common/Input/Input";
import {
  AllStudentResultsAPI,
  studentResultsAPI,
  uploadResultsAPI,
} from "../../../services/apis/results";
import { resultStyle } from "./style";
import { toast } from "react-toastify";
import LoadingComp from "../../../components/common/loading/Loading";

const ResultScreen = () => {
  const { isDesktop } = useResponsive();
  const store = useSelector((state: any) => state?.auth?.login?.data);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [allResultsData, setAllResultsData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const AllFetchData = async () => {
    setLoading(true);
    try {
      if (store.user.role === "Admin") {
        const allResults = await AllStudentResultsAPI(store?.token);
        setLoading(false);
        const allStudents = await AllStudentsAPI(store?.token);
        setLoading(false);
        setStudents(allStudents?.data?.students);
        setAllResultsData(allResults?.data?.results);
      } else {
        const studentData = await studentResultsAPI(
          store.token,
          store?.user?.studentId
        );
        setLoading(false);
        setStudentData(studentData?.data?.results);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleStudentChange = (e: { target: { value: any } }) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    const student = students.find((s: { _id: any }) => s._id === studentId);
    setSelectedStudent(student);
  };

  useEffect(() => {
    AllFetchData();
  }, []);

  const submitHandler = async () => {
    const payload = {
      marks: marks,
      subject: subject,
      grade: grade,
      studentId: selectedStudent?.studentId,
    };
    try {
      const response = await uploadResultsAPI(store?.token, payload);
      setLoading(false);
      toast.success(response.data.message);
      setSelectedStudent(null);
      AllFetchData();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <WrapperComp title="Results">
      {loading ? (
        <LoadingComp loading={loading} setLoading={setLoading} />
      ) : (
        <>
          {store?.user?.role === "Admin" && (
            <Box sx={resultStyle.listBox}>
              <select
                value={selectedStudentId}
                onChange={handleStudentChange}
                style={resultStyle.select}
              >
                <option value="">Select Student</option>
                {students.map((student: any) => (
                  <option key={student._id} value={student._id}>
                    {student.organizationName}
                  </option>
                ))}
              </select>
              <InputComp
                label="Marks"
                tooltipContent="Marks"
                type="text"
                sx={{ flex: 1 }}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
              <InputComp
                label="Subject"
                tooltipContent="Subject"
                type="text"
                sx={{ flex: 1 }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <InputComp
                label="Grade"
                tooltipContent="Grade"
                type="text"
                sx={{ flex: 1 }}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <Button variant="outlined" onClick={submitHandler}>
                Submit
              </Button>
            </Box>
          )}
          {selectedStudent && (
            <Box sx={resultStyle.listCtn}>
              <Typography>
                {" "}
                Name:- {selectedStudent.organizationName}{" "}
              </Typography>
              <Typography> Email:- {selectedStudent.email} </Typography>
              <Typography> Phone:- {selectedStudent.phone} </Typography>
              <Typography> StudentId:- {selectedStudent.studentId} </Typography>
            </Box>
          )}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexDirection={isDesktop ? "row" : "column"}
            gap={2}
            mt={2}
          >
            <CardComp sx={{ width: "100%" }} fullCard>
              <TableComp
                data={
                  store?.user?.role === "Admin" ? allResultsData : studentData
                }
                title={
                  store?.user?.role === "Admin"
                    ? "All Students Result List"
                    : "Result List"
                }
                columns={
                  store?.user?.role === "Admin"
                    ? resultTableColumnsForAdmin
                    : resultTableColumnsForStudent
                }
              />
            </CardComp>
          </Box>
        </>
      )}
    </WrapperComp>
  );
};

export default ResultScreen;

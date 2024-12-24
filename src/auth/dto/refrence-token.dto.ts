import { IsString } from "class-validator";

export class refreshTokenDto {
    @IsString()
    refreshToken: string;

    // @IsString()
    // userId: string;
}


// {
//     "user": {
//         "id": 1,
//         "phoneNumber": "+77714698561"
//     },
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM0NjkyOTc0LCJleHAiOjE3MzQ2OTY1NzR9.uOo8NCdEuECyJfiSEHu53Rgv8ma8gWJ3oEoGfcxIq2I",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM0NjkyOTc0LCJleHAiOjE3MzUyOTc3NzR9.cHt_eB3eHSGdEST3JewATEIWG1JhPD3kj_YsyXf-Gt8"
// }
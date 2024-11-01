import { Component } from '@angular/core';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [],
  templateUrl: './exam.component.html',
  styleUrls: ['./../dashboard/dashboard.component.scss', './exam.component.scss']
})
export class ExamComponent {

  dataQuiz2: any
  = {
    "id": 1,
    "logo": "./assets/img/experience/ic_input-text.svg",
    "rute": "card-input",
    "type": "quiz",
    "name": "What I do!",
    "configure": {
        "icon": "sight-word",
        "title": "Activity 1: Outdoor sports",
        "sub_title": "LET’S OBSERVE!",
        "description": "Classify the pictures into team sports and individual sports.",
        "img_start": "./assets/img/experience/ic_notebook_start.svg",
        "img_end": "./assets/img/experience/ic_notebook_end.svg"
    },
    "level": 1,
    "time": 600,
    "answered" : false,
    "questions":[
      {
        "id": 1,
        "name_en": "1",
        "name_es": "One",
        "image": "assets/img/experience/x8/pic_nutritional-feature.png",
        "audio": [],
        "bg": "#9CA9D3", "c": "#212121",
        "questionTypeId": 1,        
        "question_name_en": "What is the chart about?",
        "question_name_es": "¿De qué trata el gráfico?",
        "options_drop": "",
        "suggestion": [
          { "text": "*^LEAD IN!^* <br> <sub> *^Look^* at the chart and *^answer^* the questions. </sub> <br> <sup> Activity 2: Healthy Food Habits </sup>" },
          { "text": "*^Overweight^* occurs for two main reasons: Lack of physical activity and excessive consumption of *^junk^* food and ultra-processed food that is rich in sugar, salt and saturated *^fat^*. <br><br>Adapted from Instituto Nacional del Perú, Ministerio de Salud" }
        ],       
        "configure": {
          "check": false, 
          "isAnswer": false,
          "time": 0,
          "clockout": 0
        },
        "options": [
          {
            "id": 1,
            "questionId": 0,
            "icon": "",
            "name": "Diabetes",
            "title": "Diabetes",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": false
          },
          {
            "id": 2,
            "questionId": 0,
            "icon": "",
            "name": "Overweight and obesity",
            "title": "Sobrepeso y obesidad",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": true
          }
        ]
      },
      {
        "id": 2,
        "name_en": "2",
        "name_es": "Two",
        "image": "assets/img/experience/x8/pic_nutritional-feature.png",
        "audio": [],
        "bg": "#9CA9D3", "c": "#212121",
        "questionTypeId": 1,        
        "question_name_en": "What causes overweight and obesity?",
        "question_name_es": "¿Qué causa el sobrepeso y la obesidad?",
        "options_drop": "",
        "suggestion": [
          { "text": "*^LEAD IN!^* <br> <sub> *^Look^* at the chart and *^answer^* the questions. </sub> <br> <sup> Activity 2: Healthy Food Habits </sup>" },
          { "text": "*^Overweight^* occurs for two main reasons: Lack of physical activity and excessive consumption of *^junk^* food and ultra-processed food that is rich in sugar, salt and saturated *^fat^*. <br><br>Adapted from Instituto Nacional del Perú, Ministerio de Salud" }
        ],       
        "configure": {
          "check": false, 
          "isAnswer": false,
          "time": 0,
          "clockout": 0
        },
        "options": [
          {
            "id": 1,
            "questionId": 0,
            "icon": "",
            "name": "Ultra-processed food",
            "title": "Alimentos ultraprocesados",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": false
          },
          {
            "id": 2,
            "questionId": 0,
            "icon": "",
            "name": "Lack of exercise",
            "title": "Falta de ejercicio",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": true
          },
          {
            "id": 3,
            "questionId": 0,
            "icon": "",
            "name": "Good eating habits",
            "title": "Buenos hábitos alimenticios",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": false
          }
        ]
      },
      {
        "id": 3,
        "name_en": "3",
        "name_es": "Three",
        "image": "assets/img/experience/x8/pic_nutritional-feature.png",
        "audio": [],
        "bg": "#9CA9D3", "c": "#212121",
        "questionTypeId": 1,        
        "question_name_en": "Which group is most overweight or obese?",
        "question_name_es": "¿Qué grupo tiene más sobrepeso u obesidad?",
        "options_drop": "",
        "suggestion": [
          { "text": "*^LEAD IN!^* <br> <sub> *^Look^* at the chart and *^answer^* the questions. </sub> <br> <sup> Activity 2: Healthy Food Habits </sup>" },
          { "text": "*^Overweight^* occurs for two main reasons: Lack of physical activity and excessive consumption of *^junk^* food and ultra-processed food that is rich in sugar, salt and saturated *^fat^*. <br><br>Adapted from Instituto Nacional del Perú, Ministerio de Salud" }
        ],       
        "configure": {
          "check": false, 
          "isAnswer": false,
          "time": 0,
          "clockout": 0
        },
        "options": [
          {
            "id": 1,
            "questionId": 0,
            "icon": "",
            "name": "Children",
            "title": "Niños",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": false
          },
          {
            "id": 2,
            "questionId": 0,
            "icon": "",
            "name": "Teenagers",
            "title": "Jovenes",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": false
          },
          {
            "id": 3,
            "questionId": 0,
            "icon": "",
            "name": "Adults",
            "title": "Adultos",
            "video": {  
            },
            "input": {                 
            },
            "isAnswer": true
          }
        ]
      }
    ]
  };




}

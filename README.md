# personal_project_with_arduino_java_react


# Remote Control Arduino Kit

이 프로젝트의 주요 목표는 아두이노 키트와 센서를 활용하여 실시간 데이터를 수집하고, 이를 웹페이지에 동적으로 표현하는 것입니다.

<img src="[https://img.shields.io/badge/JAVA-007396?style=for-the-badge&logo=java&logoColor=white](https://img.shields.io/badge/JAVA-007396?style=for-the-badge&logo=java&logoColor=white)">

<svg role="img" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">

<svg role="img" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">

## 주요 목표

아두이노 키트와 센서를 활용하여 실시간 데이터를 수집하고, 이를 웹페이지에 동적으로 표현

## 프로젝트 개요

아두이노 키트와 다양한 센서들을 이용하여 실시간으로 데이터를 수집하고, 웹 페이지에 동적으로 표현하는 것을 목표로 하였습니다. 온도, 조도, 그리고 움직임을 측정할 수 있는 센서를 이용하고, 사용자가 현재 상태를 쉽게 파악하고 관리할 수 있도록 상태 초기화 및 디스플레이 모드 전환 기능을 구현하였습니다. 

## 프로젝트 내용

1. 아두이노 및 센서 설정
    - 온도, 조도, 초음파 센서 연결
    - 초음파 센서를 통한 카운트 기능 구현
    - 상태 초기화 및 디스플레이 모드 전환 버튼 설정
2. 데이터 수집 및 서버 전송
    - 아두이노를 통한 데이터 수집
    - 아두이노의 와이파이 모듈을 통한 서버 전송 설정
    - 자바를 통한 데이터 수신 및 데이터 가공 후 JSON 형태로 변환하여 프론트엔드로 데이터 전송
3. 프론트엔드 개발
- 리액트 프레임워크를 이용한 웹페이지 구성
    
    데이터를 그래프로 시각화
    
    백엔드로부터의 데이터 수신 및 표시
    
    ![기본동작gif.gif](md%20b3c2926378984bd0adb84b5455a3e74e/%25EA%25B8%25B0%25EB%25B3%25B8%25EB%258F%2599%25EC%259E%2591gif.gif)
    

- 갱신시간을 조절해 서버로부터의 데이터 수신 주기를 조절
    
    ![갱신시간 조절gif.gif](md%20b3c2926378984bd0adb84b5455a3e74e/%25EA%25B0%25B1%25EC%258B%25A0%25EC%258B%259C%25EA%25B0%2584_%25EC%25A1%25B0%25EC%25A0%2588gif.gif)
    

- 조도에 따른 웹페이지 배경 밝기 자동 조절 기능 구현
    
    ![밝기 조절gif.gif](md%20b3c2926378984bd0adb84b5455a3e74e/%25EB%25B0%259D%25EA%25B8%25B0_%25EC%25A1%25B0%25EC%25A0%2588gif.gif)
    

- 초기화 버튼 클릭 시 아두이노에 신호를 보내 아두이노의 리셋 기능 작동
    
    ![초기화 기능gif.gif](md%20b3c2926378984bd0adb84b5455a3e74e/%25EC%25B4%2588%25EA%25B8%25B0%25ED%2599%2594_%25EA%25B8%25B0%25EB%258A%25A5gif.gif)
    

##

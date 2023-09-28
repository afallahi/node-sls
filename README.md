<div align="center">
	<a><img width="150" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></a>
	<a><img width="150" src="https://user-images.githubusercontent.com/25181517/183896132-54262f2e-6d98-41e3-8888-e40ab5a17326.png" alt="AWS" title="AWS"/></a>
</div>

<p align="center">
	<a><img width="60" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></a>
	<a><img width="60" src="https://user-images.githubusercontent.com/25181517/121401671-49102800-c959-11eb-9f6f-74d49a5e1774.png" alt="npm" title="npm"/></a>
	<a><img width="60" src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" title="PostgreSQL"/></a>
  <a><img width="60" src="https://user-images.githubusercontent.com/25181517/186711335-a3729606-5a78-4496-9a36-06efcc74f800.png" alt="Swagger" title="Swagger"/></a>
	<a><img width="60" src="https://user-images.githubusercontent.com/25181517/192109061-e138ca71-337c-4019-8d42-4792fdaa7128.png" alt="Postman" /></a>
	
</p>

# Serverless Application with Node.js and AWS

## Product Requirements

- Serverless Application
- Users can register, login and view their profile

## System Design

<p align="center">
  <img  src="./user-service/Serverless_CodePipeline.png">
</p>

### Functional Requirements
- User register and login
- User verfication with OTP/SMS
  
### Non-Functional Requirements
### Database Requirements

## Tech Stack
- Node.js
- Typescript
- AWS Lambda
- Serverless Framework
- PostgreSQL
- REST API
- Docker
- - AWS CodePipeline (CI/CD)
- AWS Parameter Store

## Usage

### Deployment

Install dependencies:

```
npm install
```

deploy locally:

```
make start_db 	# start Docker with PostgreSQL
npm run dev
```

deploy locally and generate swagger:

```
make start_db 	# start Docker with PostgreSQL
npm run start
```
swagger will be available at `https://{base-url}/swagger`

![swagger](https://github.com/afallahi/node-sls/assets/73287428/143426aa-79b2-4b20-a49b-68bbb88e0553)


deploy to the cloud manually:

```
npm run deploy
```

### CI/CD with CodePipeline

- Push your changes and merge the branch into `master`.
- CodeBuild pulls the changes and uses `buildspec.yml` to create a new build. CodeDeploy deploys the new build.


![codepipeline](https://github.com/afallahi/node-sls/assets/73287428/19b11d52-851a-4136-ae06-410bd21f3321)



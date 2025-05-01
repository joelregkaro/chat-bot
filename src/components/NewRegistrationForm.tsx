import React, { useState, ChangeEvent, FormEvent } from 'react';

const AppRegisterkaroForm: React.FC = () => {
  // const [formData, setFormData] = useState({
  //   SingleLine: '',
  //   Email: '',
  //   PhoneNumber_countrycodeval: '',
  //   PhoneNumber_countrycode: '',
  //   Dropdown: '-Select-',
  // });

  // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
   

  //   // You can run your validation here or use zf_ValidateAndSubmit if defined elsewhere
  //   const isValid = typeof zf_ValidateAndSubmit === 'function' ? zf_ValidateAndSubmit() : true;

  //   if (isValid) {
  //     e.currentTarget.submit();
  //   }
  // };

  const styles = `
	/* $Id: $ */
  @charset "UTF-8";

	.ul{
	  margin: 0;
		padding: 0;
		border: 0;
		font: inherit;
		vertical-align: baseline;
	}
	.zf-formHeading {
		background-attachment: fixed;
		color: #444444;
		font: 75%/1.3 Arial, Helvetica, sans-serif;
		margin: 0 auto;
	}
	
	input, input[type="text"],input[type="email"], input[type="search"] {
		outline:none;
		margin:0 auto;
		padding:5px 10px;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box;    /* Firefox, other Gecko */
		box-sizing: border-box;         /* Opera/IE 8+ */
	}
	input[type="text"]::-webkit-input-placeholder {
		color: white;
	  }
	  input[type="email"]::-webkit-input-placeholder {
		color: white;
	  }
	
	.zf-flLeft {
		float:left;
	}
	.zf-flRight {
		float:right;
	}
	.zf-clearBoth {
		 clear:both;
	}
	.ul {
		list-style: none outside none !important;
	}
	.zf-normalText {
		font-size:13px;
		line-height:1.5;
	}
	.zf-smallText {
		font-size:0.9em;
		font-weight:normal;
	}
	.zf-smallHeading {
		font-size:18px;
	}
	.zf-heading {
		font-size:2em;
	}
	.zf-subHeading {
		font-size:1.5em;
	}
	.zf-boldText, .zf-boldText a {
		font-weight:bold;
		text-decoration:none;
	}
	.zf-italicText {
		font-style:italic;
	}
	.zf-formHeading{
		color:#F8FCFF;
		font-weight:bold;
		font-size:17px;
		margin-top:30px;
		margin-bottom:15px;
		text-align:justify;
	}
	.zf-heading {
		text-decoration:underline;
	}
	.zf-heading {
		text-decoration:none;
	}
	.zf-blodText {
		font-weight:bold;
	}
	.zf-overAuto {
		overflow:auto;
	}
	.zf-split {
		color: #8B9193;
		padding: 0 3px;
	}
	
	.zf-backgroundBg {
		//background:#f5f5f5;
	}
	
	.zf-templateWidth {
		// margin:1% auto;	
		
	}
	
	.zf-templateWidth { 
		}
	.highlightedHeadingText{
		color:#FFA229;
	}
	.zf-templateWrapper {
		// background:#000;
	   //  background:#164760;
		-moz-box-shadow: 0 0px 3px #E1E1E1;
		-webkit-border-radius:2px;
		-moz-border-radius:2px;
	  //	border-radius:15px;
		border: 1px solid rgba(174, 192, 202, 1);
		
	}
	
	.zf-tempContDiv input[type="text"],input[type="email"], .zf-tempContDiv textarea, .zf-tempContDiv .zf-pdfTextArea {
		background:#376176;	
		border: 1px solid #376176;	
		color: white;
		-webkit-border-radius:2px; 	
		-moz-border-radius:2px;	
		border-radius:5px;	
		padding:10px;
		font-size:13px;	
	}
	
	.zf-tempContDiv input[type="text"]:hover,input[type="email"]:hover,  .zf-tempContDiv textarea:hover{	
		border:1px solid rgba(157, 157, 157, 0.75) !important;	
		}	
	.zf-tempContDiv input[type="text"]:focus,input[type="email"]:focus, .zf-tempContDiv textarea:focus{	
		border:1px solid rgba(121, 187, 238, 0.75) !important;	
		-webkit-box-shadow:0 0 5px rgba(82, 168, 236, 0.5) !important;	
		-moz-box-shadow:0 0 5px rgba(82, 168, 236, 0.5) !important;	
		box-shadow:0 0 5px rgba(82, 168, 236, 0.5) !important;	
		}
		
	.zf-tempContDiv textarea {
		height:75px;
	}
	.arrangeAddress .zf-addrCont  .zf-addtwo{ width: 99% !important;float: none !important;} 		
	/**********Error Message***********/	
	.zf-errorMessage {
		font:12px Arial, Helvetica, sans-serif;
		color:#ff0000;
		padding-top:5px;
	}
	
	/**********Mandatory Message***********/	
	.zf-important {
		color:#ff0000 !important;
		font-weight: normal;
		margin-left:0px;
		padding: 0;
		font-size:13px !important;
	}
	
	/**********instruction Message***********/
	.zf-instruction {
		color:#939393;
		font-style:italic;
		margin-top:3px;
		font-size:12px;
		overflow:visible !important;
		word-break: break-all;
		margin-bottom: 3px;
	}	
	
	.zf-symbols {
		padding:0 5px;
	}
	
	.zf-overflow{ overflow:hidden;}
	
	/*****************template Header Starts Here****************/
	
	.zf-tempHeadBdr {
		margin:0;
		padding:0;
		overflow:hidden;
	}
	
	.zf-tempHeadContBdr {
	//	border-bottom:1px solid #EAEAEA;
		margin: 0;
		padding:10px 25px;
		-webkit-border-radius:2px 2px 0 0;
		-moz-border-radius:2px 2px 0 0;
		border-radius:2px 2px 0 0;
	}
	.zf-tempHeadContBdr .zf-frmTitle {
		background: linear-gradient(90deg, rgba(30, 68, 108, 1), rgba(58, 132, 210, 1));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
		// color: black;
		margin: 0;
		padding: 0;
		font-size:25px;
    text-align:left;
	font-weight: 600 !important;

	}
	.zf-tempHeadContBdr .zf-frmDesc {
		color: #000;
		font-size: 14px;
		font-weight: normal;
		margin: 0;
		padding: 0;
	}
	
	/****************template Header Ends Here****************/
	
	
	.zf-subContWrap {
		padding:0;
		margin:10px;
		margin-bottom:0;
	}
	
	.zf-tempFrmWrapper {
		padding:10px 15px;
		margin:1px 0;
	}
	
	.zf-tempFrmWrapper .zf-tempContDiv {
		margin:0;
		padding:0;
	}
	
	.zf-tempFrmWrapper .zf-labelName {
		font-weight:bold;
		font-size:13px;
		color:#517588;
		font-size: 0.8rem;
	  
	}
	
	.zf-form-sBox{ 
		
		padding:10px; 
		border:1px solid #376176; 
		font-size:13px;
		border-radius: 5px;
		background:#376176;
		color:white;
		outline:none;
		
		
		}
	
	.zf-form-sBox::-webkit-scrollbar{
		width:7px;
		background:white;
	}
	.zf-form-sBox::-webkit-scrollbar-thumb{
		
		border-top: 60px solid #FFA229 ;
		
	}
	
	
	.zf-name .zf-tempContDiv, .zf-phone .zf-tempContDiv span, .zf-time .zf-tempContDiv{
		float: left;
		display:block;
	}
	
	.zf-name .zf-tempContDiv span{margin-bottom:5px; margin-left: 4%;}
	.zf-name .zf-tempContDiv span.last{ margin-right:0;}
	.zf-name .zf-tempContDiv span { display: block;padding-top:3px;}
	.zf-name .zf-tempContDiv input[type="text"] {width:100%;}
	.zf-name .zf-tempContDiv input[type="email"] {width:100%;}
	
	
	.zf-phone .zf-tempContDiv, .zf-date .zf-tempContDiv, .zf-time .zf-tempContDiv, .zf-address .zf-tempContDiv, .zf-geolocation .zf-tempContDiv , .zf-name .zf-tempContDiv{ 
		font-size:11px; 
		padding-top:3px;
		}
	.zf-phone .zf-tempContDiv, .zf-date .zf-tempContDiv, .zf-time .zf-tempContDiv, .zf-address .zf-tempContDiv, .zf-name .zf-tempContDiv  {
		color:#888888;
		
		}
	.zf-phone .zf-tempContDiv   {
		display: block;
		padding-top:3px;
		text-align:center;
	}
	.zf-phone .zf-tempContDiv .zf-symbols {
		padding-top:5px;
	}
	
	
	.zf-currency .zf-tempContDiv { 
		display:inline-block;
		}
	.zf-currency .zf-tempContDiv   {
		display: block;
		padding-top:3px;
		}
	.zf-currency .zf-tempContDiv .zf-symbol {
		font-size: 14px;
		margin-left:5px;
		margin-top: 4px;
		width:auto;
		font-weight:bold;
		}
	
	.zf-decesion .zf-tempContDiv{ 
		width:100% !important; 
		margin-top:4px;
		}
	.zf-decesion input[type="checkbox"] {
		display: block;
		height: 13px;
		margin: 0;
		padding: 0;
		width: 13px;
		float:left;
		margin-top:4px;
	}
	.zf-decesion  {
		display: block;
		line-height:21px;
		margin: 0px 0 0 25px !important;
		padding-bottom: 0 !important;
		width:95% !important;
		float:none !important;
		line-height:21px !important;
		text-align:left !important;
	} 
	
	.zf-tempContDiv input[type="file"]{
		outline:none;
		border:1px solid #ccc;
		margin:0 auto;
		padding:5px;
		width:auto;
	}
	
	
	.zf-address .zf-tempContDiv , .zf-geolocation .zf-tempContDiv  {
		display:block;
		padding-bottom:15px;
		margin-right:2%;
		}
		
	.zf-address .zf-tempContDiv  , .zf-geolocation .zf-tempContDiv  {
		display: block;
		padding-top:3px;
		}	
		
	.zf-address .zf-tempContDiv .zf-addOne, .zf-geolocation .zf-tempContDiv .zf-addOne{
		float: none;
		padding-bottom:15px;
		margin-right:0;
		}
	
	.zf-address .zf-tempContDiv .zf-addOne input, .zf-geolocation .zf-tempContDiv .zf-addOne input{
		width:98%;
		}
	.zf-address .zf-tempContDiv .zf-addtwo, .zf-geolocation .zf-tempContDiv .zf-addtwo{
		width:48%;
		}
	.zf-address .zf-tempContDiv .zf-addtwo input, .zf-geolocation .zf-tempContDiv .zf-addtwo input{
		width:99%;
		}	
	.zf-address .zf-tempContDiv .zf-addtwo .zf-form-sBox{
		width:100%;
		}
		
	.zf-signContainer{ 
		margin:0; 
		padding:0; 
		width:100%;
		}
	.zf-signContainer canvas{ 
		cursor:crosshair;
		border:1px solid #ccc; 
		background:#fff;
		}
	.zf-signContainer a{
		font-size: 11px;
		text-decoration: underline;
		}	
		
	.zf-section{
		 border-bottom:1px solid #D7D7D7;
		font-size:22px; 
		color:#000; 
		font-weight:500; 
		font-family:'Open Sans',"Lucida Grande",Arial,Helvetica,sans-serif; 
		padding-bottom:10px;
	}
	.zf-section p{ 
		color:#847F7F; 
		margin-top:10px;
	}
		
	.zf-note .zf-labelName{	
		padding-top:7px;
		color:#517588;
	}

    .zf-templateWrapper ul{
        list-style:none;
        padding-left: 0px;
    }

    .zf-templateWrapper ul .zf-fmFooter{
        width: 100%
    }
    .zf-templateWrapper ul .zf-fmFooter .zf-submitColor{
        width: 80%
    }

	
	.zf-templateWrapper .zf-note{ 
		overflow:hidden;
		}
	
	.zf-date .zf-tempContDiv span  {
		display: block;
		padding-top:3px;
		text-align:left;
	}
	
	.zf-subDate{ margin-right:10px;}
	.zf-subDate { text-align:left !important;}
	
	.zf-time .zf-tempContDiv span  {
		display: block;
		padding-top:3px;
		text-align:center;
	}
	
	.zf-time .zf-tempContDiv .zf-form-sBox{
		min-width:58px;
	}
	
	.zf-time .zf-tempContDiv .zf-symbols {
		padding-top:5px;
	}
	
	.zf-tempContDiv input[type="checkbox"], .zf-tempContDiv input[type="radio"] {
		display: block;
		height: 13px;
		margin: 4px 0 0;
		padding: 0;
		width: 13px;
		
	}
	
	.zf-radio .zf-overflow, .zf-checkbox .zf-overflow{padding-left:2px !important;
		
	}
	
	.zf-sideBySide .zf-tempContDiv span {
		margin: 0 15px 5px 0;
		padding:0;
		width:auto;
		float: left;
		display:block;
	}
	.zf-sideBySide .zf-tempContDiv span input[type="checkbox"] {
		display: block;
		width: 13px;
		height: 13px;
		padding: 0;
		margin-top:3px;
		float:left;
	}
	.zf-sideBySide .zf-tempContDiv span input[type="radio"] {
		display: block;
		width: 13px;
		height: 13px;
		margin-top:4px;
		padding: 0;
		float:left;
	}
	.zf-sideBySide .zf-tempContDiv  {
		line-height:21px;
		display: block;
		margin: 0 0 0 20px;
		padding: 0 0 5px;
	}
			
	
	.zf-oneColumns .zf-tempContDiv  {
		margin:0 0 13px 0;
		padding:0;
		width:100%;
		display:block;
		clear: both;
	}
	.zf-oneColumns .zf-tempContDiv span:last-child { margin-bottom:0;}
	
	.zf-oneColumns .zf-tempContDiv span input[type="checkbox"] {
		display: block;
		width: 13px;
		height: 13px;
		margin:0;
		padding: 0;
		margin-top:3px;
		float:left;
	}
	.zf-oneColumns .zf-tempContDiv span input[type="radio"] {
		display: block;
		width: 13px;
		height: 13px;
		margin-top:4px;
		padding: 0;
		float:left;
	}
	.zf-oneColumns .zf-tempContDiv span {
		line-height:19px;
		display: block;
		margin: 0 0 0 20px;
		padding:0;
		font-size:13px;
	}
	
	.zf-twoColumns .zf-tempContDiv span {
		margin: 0 5px 13px 0;
		width: 48%;
		float: left;
		display:block;
	}
	.zf-twoColumns .zf-tempContDiv span input[type="checkbox"] {
		display: block;
		width: 13px;
		height: 13px;
		margin: 0;
		padding: 0;
		margin-top:3px;
		float:left;
	}
	.zf-twoColumns .zf-tempContDiv span input[type="radio"] {
		display: block;
		width: 13px;
		height: 13px;
		margin-top:4px;
		padding: 0;
		float:left;
	}
	.zf-twoColumns .zf-tempContDiv span  {
		line-height:21px;
		display: block;
		margin: 0 0 0 20px;
		padding: 0 0 5px;
	}
	.zf-threeColumns .zf-tempContDiv span {
		margin: 0 5px 13px 0;
		width:30%;
		float: left;
	}
	.zf-threeColumns .zf-tempContDiv span input[type="checkbox"] {
		display:block;
		width: 13px;
		height: 13px;
		padding: 0;
		margin-top:3px;
		float:left;
	}
	.zf-threeColumns .zf-tempContDiv span input[type="radio"] {
		display:block;
		width: 13px;
		height: 13px;
		margin-top:4px;
		padding: 0;
		float:left;
	}
	.zf-threeColumns .zf-tempContDiv span label {
		line-height:21px;
		display: block;
		margin: 0 0 0 20px;
		padding: 0 0 5px;
	}
	
	.zf-mSelect select{ font-size:13px;}	
	
	.zf-fmFooter {
		margin:0;
		padding:25px;
		padding-top:30px;
		text-align:center;
	}
	
	.zf-fmFooter .zf-submitColor{ font-size:14px; padding:4px 10px;}
	
	.zf-submitColor{
		color: #fff;
		font-weight:bold;
		border:1px solid;
		border-color: #FFA229;
		border-radius:30px;
		background: #FFA229;
		width:auto;
		height:40px;
	
		}
		
	
	/****************Field Small/Medium/Large Starts Here****************/
	
	.zf-small .zf-tempContDiv input[type="text"],input[type="email"], .zf-small .zf-tempContDiv textarea, .zf-small .zf-mSelect select, .zf-small .zf-tempContDiv .zf-sliderCont, .zf-small .zf-tempContDiv .zf-pdfTextArea{
		width:50%;
		}
	.zf-medium .zf-tempContDiv input[type="text"],input[type="email"], .zf-medium .zf-tempContDiv textarea, .zf-medium .zf-mSelect select, .zf-medium .zf-tempContDiv .zf-sliderCont, .zf-medium .zf-tempContDiv .zf-pdfTextArea{
		width:75%;
		
		}
	.zf-large .zf-tempContDiv input[type="text"],input[type="email"], .zf-large .zf-tempContDiv textarea, .zf-large .zf-mSelect select, .zf-large .zf-tempContDiv .zf-sliderCont, .zf-large .zf-tempContDiv .zf-pdfTextArea{
		width:100%;
		background: white;
		color: black;
		border: 1px solid rgba(174, 192, 202, 1);
		border-radius: 20px;
		}
		.zf-large .zf-tempContDiv input[type="text"]::placeholder{
		color: rgba(174, 192, 202, 1);
		}

		.zf-large .zf-tempContDiv .zf-form-sBox {
		border: 1px solid rgba(174, 192, 202, 1);
		border-radius: 20px;
		}
		
		
	.zf-small .zf-tempContDiv .zf-form-sBox{
		width:50%;
		}
	.zf-medium .zf-tempContDiv .zf-form-sBox{
		width:75%;
		}
	.zf-large .zf-tempContDiv .zf-form-sBox{
		width:100%;
		background: white;
		color: rgba(189, 189, 189, 1);
		}
	
	
	.zf-name .zf-tempContDiv .zf-form-sBox{
		width:100%;
		}
	
	.zf-namesmall .zf-nameWrapper{ width: 50%;}
	.zf-namesmall .zf-tempContDiv span{width:48%;}
	 
	.zf-namesmall .zf-oneType .zf-salutationWrapper span{width:63%; }
	.zf-namesmall .zf-oneType .zf-salutationWrapper .zf-salutation{ width: 33%;}
	
	.zf-namesmall .zf-twoType .zf-salutationWrapper span{width:34%;margin-left:3%;}
	.zf-namesmall .zf-twoType .zf-salutationWrapper .zf-salutation{ width:26%;}
	
	.zf-namesmall .zf-threeType .zf-nameWrapper span{width:32%; margin-left:2%;}
	
	.zf-namesmall .zf-threeType .zf-salutationWrapper span{ width:100%;margin-left: 0px; float:none; margin-left: 0;}
	.zf-namesmall .zf-threeType .zf-salutationWrapper .zf-salutation{ width:50%;}
	
	
	.zf-namesmall .zf-tempContDiv span:first-child{ margin-left:0;}
	
	.zf-leftAlign .zf-namesmall .zf-threeType .zf-salutationWrapper span, .zf-rightAlign .zf-namesmall	.zf-threeType .zf-salutationWrapper span{ width:100%;margin-left: 0px; float:none; margin-left: 0;}
	.zf-leftAlign .zf-namesmall .zf-threeType .zf-salutationWrapper .zf-salutation, .zf-rightAlign .zf-namesmall .zf-threeType .zf-salutationWrapper .zf-salutation{ width: 50%; }
	
	
	
	
	.zf-namemedium .zf-nameWrapper{ width: 75%;}
	
	.zf-namemedium .zf-tempContDiv span{width:49%; margin-left:2%;}
	
	
		
	.zf-namemedium .zf-oneType .zf-salutationWrapper span{width:73%; }
	.zf-namemedium .zf-oneType .zf-salutationWrapper .zf-salutation{ width: 25%;}
	
	.zf-namemedium .zf-twoType .zf-salutationWrapper span{width:38%;margin-left:2%;}
	.zf-namemedium .zf-twoType .zf-salutationWrapper .zf-salutation{ width:20%;}
	
	
	.zf-namemedium .zf-threeType .zf-nameWrapper span{width:32%; margin-left:2%;}
	
	
	.zf-namemedium .zf-threeType .zf-salutationWrapper span{width:25%;margin-left:2%;}
	
	.zf-namemedium .zf-threeType .zf-salutationWrapper .zf-salutation{ width:19%;}
	
	.zf-namemedium .zf-tempContDiv span:first-child{ margin-left:0;}
	
	.zf-namelarge .zf-tempContDiv span{width:23.5%; margin-left:2%; margin-right: 0; margin-bottom: 0;}
	.zf-namelarge .zf-twoType .zf-nameWrapper span{width:49%; margin-left:2%;}
	.zf-namelarge .zf-threeType .zf-nameWrapper span{width:32%; margin-left:2%;}
	
	
	.zf-namelarge .zf-twoType .zf-salutationWrapper span{width:40%; margin-left:2%;}
	.zf-namelarge .zf-twoType .zf-salutationWrapper .zf-salutation{ width: 16%;}
	
	.zf-namelarge .zf-threeType .zf-salutationWrapper span{width:26%; margin-left:2%;}
	.zf-namelarge .zf-threeType .zf-salutationWrapper .zf-salutation{ width: 16%;}
	
	.zf-namelarge .zf-oneType .zf-salutationWrapper span{width:73%; margin-left:2%;}
	.zf-namelarge .zf-oneType .zf-salutationWrapper .zf-salutation{ width:25%;}
	
	.zf-namelarge .zf-tempContDiv span:first-child { margin-left:0 !important;}
	
	
	
	.zf-csmall	 .zf-tempContDiv input[type="text"] {
		width:43%;
		}
	.zf-cmedium .zf-tempContDiv input[type="text"] {
		width:67%;
		}
	.zf-clarge	 .zf-tempContDiv input[type="text"] {
		width:91%;
		} 	
	
	.zf-nsmall .zf-tempContDiv input[type="text"] {	
		width:50%;	
		}
	.zf-nmedium .zf-tempContDiv input[type="text"] {
		width:75%;
		}
	.zf-nlarge .zf-tempContDiv input[type="text"] {
		width:100%;
		}
	
		.zf-csmall	 .zf-tempContDiv input[type="email"] {
			width:43%;
			}
		.zf-cmedium .zf-tempContDiv input[type="email"] {
			width:67%;
			}
		.zf-clarge	 .zf-tempContDiv input[type="email"] {
			width:91%;
			} 	
		
		.zf-nsmall .zf-tempContDiv input[type="email"] {	
			width:50%;	
			}
		.zf-nmedium .zf-tempContDiv input[type="email"] {
			width:75%;
			}
		.zf-nlarge .zf-tempContDiv input[type="email"] {
			width:100%;
			}
	
	.zf-signSmall .zf-tempContDiv .zf-signContainer .zf-signArea {	
		width:49%;
		}
	.zf-signMedium .zf-tempContDiv .zf-signContainer .zf-signArea {
		width:60%;
		}
	.zf-signLarge .zf-tempContDiv .zf-signContainer .zf-signArea {	
		width:74%;
		}	
	
	.zf-addrsmall .zf-tempContDiv .zf-addrCont{ 
		width:50%;
		}
	.zf-addrmedium .zf-tempContDiv .zf-addrCont{ 
		width:75%;
		}
	.zf-addrlarge .zf-tempContDiv .zf-addrCont{ 
		width:100%;
		}	
		
		
	/****************Field Small/Medium/Large Ends Here****************/	
	
	.zf-topAlign .zf-tempFrmWrapper .zf-labelName {
		padding-bottom:8px;
		display:block;
	}

    .zf-topAlign ul{
        list-style: none;
        padding-left: 0px !important;
    }
	
	.zf-topAlign .zf-threeColumns .zf-labelName, .zf-topAlign .zf-twoColumns .zf-labelName, .zf-topAlign .zf-oneColumns .zf-labelName, .zf-topAlign .zf-sideBySide .zf-labelName{ padding-bottom:8px;}
	
	.zf-leftAlign {
		display:block;
	}
	.zf-leftAlign .zf-tempFrmWrapper .zf-labelName {
		float:left;
		width:30%;
		line-height:20px;
		margin-right:15px;
	}
	.zf-leftAlign .zf-tempFrmWrapper .zf-tempContDiv {
		 margin-left: 35%;
	}

    
	
	.zf-leftAlign .zf-slider .zf-tempContDiv{ margin-top:6px;}
	
	.zf-leftAlign .zf-decesion .zf-tempContDiv, .zf-rightAlign .zf-decesion .zf-tempContDiv{ margin-left:0 !important;}
	
	.zf-rightAlign {
		display:block;
	}
	.zf-rightAlign .zf-tempFrmWrapper .zf-labelName {
		float:left;
		width:30%;
		line-height: 20px;
		text-align:right;
		margin-right:15px;
	}
	.zf-rightAlign .zf-tempFrmWrapper .zf-tempContDiv {
		 margin-left: 35%;
	}
	.zf-matrixTable{ font-size:13px; overflow-x: scroll;padding-bottom: 15px !important;}
	.zf-matrixTable table th, .zf-matrixTable table td{padding:10px;}
	.zf-matrixTable thead th, .zf-matrixTable table td{ text-align:center;}
	.zf-matrixTable table td input[type="radio"], .zf-matrixTable table td input[type="checkbox"]{ display:inline-block;}
	.zf-matrixTable tbody th{ font-weight:normal;font-size: 13px;text-align: left;}
	.zf-matrixTable thead th { font-weight:600;font-size: 13px;}
	
	/****************Form Top Align Starts Here****************/	
	
	.zf-termsContainer{ margin:0; padding:0;}
	.zf-termsContainer .zf-termsMsg {border: 1px solid #E1E1E1;max-height: 250px; min-height:70px; overflow-y:scroll; padding:10px;  margin-bottom:6px;}
	.zf-termsContainer .zf-termScrollRemove {border: 1px solid #E1E1E1;padding:10px;  margin-bottom:6px;}
	.zf-termsAccept{ margin-top:2px !important;}
	.zf-termsAccept input[type="checkbox"]{ margin-top:2px !important; float:left;}
	.zf-termsAccept label{ margin-left: 20px;font-size: 13px;float: none;display: block;}
	
	.zf-termsWrapper .zf-tempContDiv{ margin-left:0 !important;}
	.zf-termsWrapper .zf-labelName{ width:100% !important; text-align:left !important; padding-bottom:8px !important;}
	
	
	.zf-medium .zf-phwrapper {
		width: 75%;
	}
	.zf-phwrapper.zf-phNumber span {
		width: 100% !important;
	}
	.zf-phwrapper span:first-child {
		margin-left: 0;
		width: 25%;
	}
	.zf-phwrapper label {
		display: block;
		color: #888888;
		font-size: 11px;
		margin-top: 2px;
	}
	.zf-medium .zf-phonefld input[type="text"], .zf-small .zf-phonefld input[type="text"] {
		width: 100%;
	}
	.zf-medium .zf-phonefld input[type="email"], .zf-small .zf-phonefld input[type="email"] {
		width: 100%;
	}
	.zf-small .zf-phwrapper {
		width: 50%;
	}
	.zf-tempFrmWrapper.zf-phone span {
		width: auto;
		margin: inherit;
	}
	.zf-phwrapper span {
	//	margin-bottom: 10px;
		float: left;
		width: 73%;
		margin-left: 2%;
	}
	.zf-descFld a{ text-decoration:underline;}
	.zf-descFld em{ font-style:italic;}
	.zf-descFld b{ font-weight:bold;}
	.zf-descFld i{ font-style: italic;}
	.zf-descFld u{ text-decoration:underline;}
	.zf-descFld ul{ margin:auto;}
	.zf-descFld ul{ list-style:disc;}
	.zf-descFld ol{ list-style:decimal;}
	.zf-descFld ul, .zf-descFld ol{margin: 10px 0;
		padding-left: 20px;}
	
	.zf-descFld  ol.code {
		list-style-position: outside;
		list-style-type: decimal;
		padding: 0 30px;
	}
	
	.zf-descFld  ol.code li {
		background-color: #F5F5F5;
		border-left: 2px solid #CCCCCC;
		margin: 1px 0;
		padding: 2px;
	}
	
	.zf-descFld  blockquote.zquote {
		border-left: 3px solid #EFEFEF;
		padding-left: 35px;
	}
	.zf-descFld  blockquote.zquote span.txt {
		-moz-user-focus: ignore;
		-moz-user-input: disabled;
		-moz-user-select: none;
		color: #058BC2;
		float: left;
		font: bold 50px Arial,Helvetica,sans-serif;
		margin: -10px 0 0 -30px;
	}
	.zf-descFld  blockquote.block_quote {
		// background: url("../images/newQuote.gif") no-repeat scroll 12px 10px rgba(0, 0, 0, 0);
		border-left: 3px solid #EFEFEF;
		font: 13px/20px georgia,Arial,verdana,Helvetica,sans-serif;
		margin: 15px 3px 15px 15px;
		padding: 10px 10px 10px 40px;
	}
	.zf-descFld  .body {
		font-family: Arial,Helvetica,sans-serif;
		font-size: 13px;
		margin: 8px;
	}
	.note .noteCont{ overflow:hidden;}
	.note .zf-descFld{
		overflow:hidden;
		font-size: 13px;
	}
	.display-none{
	  display:none;
	}
	.padding-0{
	  padding:0px;
	}
	`;

  type FormErrors = {
    fullName?: string;
    email?: string;
    phone?: string;
    service?: string;
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    service: "-Select-",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email:string) => {
    const regex = /^[\w]([\w\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
    return regex.test(email.trim());
  };

  const validatePhone = (phone:string) => {
    const regex = /^[+]{0,1}[()0-9-. ]+$/;
    return regex.test(phone.trim());
  };

  const validateForm = () => {
    const newErrors:FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      newErrors.email = "Valid email is required.";
    }

    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      newErrors.phone = "Valid phone number is required.";
    }

    if (formData.service === "-Select-") {
      newErrors.service = "Please select a service.";
    }

	console.log(newErrors)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const zf_addDataToSalesIQ = () => {



    const visitorinfo = {
      name: formData.fullName,
      email: formData.email,
      contactnumber: formData.countryCode + formData.phone,
    };

    window.parent.postMessage(
      JSON.stringify({ type: "zoho.salesiq.apimessage", visitor: visitorinfo }),
      "*"
    );
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
	
    if (validateForm()) {
      zf_addDataToSalesIQ();
	  try {
		const res = await fetch("/api/zohoform",{
			method:"POST",
			headers:{
				'Content-Type':'application/json'
			},
			body: JSON.stringify(formData)
		});
	  } catch (error) {
		console.log('Error Submitting form:', error)
	  }
	  const form: any = document.getElementById('form');
	  form?.submit()
    }
  };


  return (
   <>
   <style>{styles}</style>
   <div className="zf-backgroundBg">
      <div className="zf-templateWidth">
        <form
          name="form"
          method="POST"
          action="https://forms.zohopublic.in/safeledgerprivatelimited/form/AppRegisterkaro2025NewWebsite/formperma/DsxfWMHHzSe-JZxKWT7IvW4bqWcUThvbA8FAJl7TTcg/htmlRecords/submit"
          onSubmit={handleSubmit}
          acceptCharset="UTF-8"
          encType="multipart/form-data"
          id="form"
        >
          <input type="hidden" name="zf_referrer_name" value="" />
          <input type="hidden" name="zf_redirect_url" value="" />
          <input type="hidden" name="zc_gad" value="" />
          <input type="hidden" name="utm_source" value="" />
          <input type="hidden" name="utm_medium" value="" />
          <input type="hidden" name="utm_campaign" value="" />
          <input type="hidden" name="utm_term" value="" />
          <input type="hidden" name="utm_content" value="" />

          <div className="zf-templateWrapper">
            <ul className="zf-tempHeadBdr">
              <li className="zf-tempHeadContBdr">
                <h2 className="zf-frmTitle">
                  <em>You're One Step Away from Hassle-Free Registration!</em>
                </h2>
                <p className="zf-frmDesc">Trusted by 50,000+ businesses. Your turn—start in minutes!"</p>
                <div className="zf-clearBoth"></div>
              </li>
            </ul>

            <div className="zf-subContWrap zf-topAlign">
              <ul>
                {/* Name */}
                <li className="zf-tempFrmWrapper zf-large">
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="SingleLine"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        maxLength={255}
                        placeholder="Full Name"
                        check-Type="c1"
                        field-type="1"
                      />
                    </span>
                   {errors.fullName && <p id="SingleLine_error" className="zf-errorMessage">
                      Invalid value
                    </p>}
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Email */}
                <li className="zf-tempFrmWrapper zf-large">
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="Email"
                        value={formData.email}
                        onChange={(e)=>
                          setFormData({...formData, email: e.target.value})
                        }
                        maxLength={255}
                        placeholder="Email"
                        check-type="c5"
                        field-type="9"
                      />
                    </span>
                    {errors.email && <p id="Email_error" className="zf-errorMessage">
                      Invalid value
                    </p>}
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Phone */}
                <li className="zf-tempFrmWrapper zf-large">
                  <div className="zf-tempContDiv zf-phonefld">
                    <div className="zf-phwrapper">
                      <span>
                      <select className="zf-form-sBox" name="PhoneNumber_countrycodeval" check-type="c7" value={formData.countryCode} onChange={(e)=> setFormData({...formData,countryCode:e.target.value})} required comp-name="PhoneNumber_countrycodeval" max-length="10" phone-format="1" is-country-code-enabled="true" id="international_PhoneNumber_countrycodeval" val-type="code" >
													<option data-countrycode="IN" value={'+91'}>IN (+91)</option>
													<option data-countrycode="DZ" value={'+213'}>DZ (+213)</option>
													<option data-countrycode="AD" value={'+376'}>AD (+376)</option>
													<option data-countrycode="AO" value={'+244'}>AO (+244)</option>
													<option data-countrycode="AI" value={'+1264'}>AI (+1264)</option>
													<option data-countrycode="AG" value={'+1268'}>AG (+1268)</option>
													<option data-countrycode="AR" value={'+54'}>AR (+54)</option>
													<option data-countrycode="AM" value={'+374'}>AM (+374)</option>
													<option data-countrycode="AW" value={'+297'}>AW (+297)</option>
													<option data-countrycode="AU" value={'+61'}>AU (+61)</option>
													<option data-countrycode="AT" value={'+43'}>AT (+43)</option>
													<option data-countrycode="AZ" value={'+994'}>AZ (+994)</option>
													<option data-countrycode="BS" value={'+1242'}>BS (+1242)</option>
													<option data-countrycode="BH" value={'+973'}>BH (+973)</option>
													<option data-countrycode="BD" value={'+880'}>BD (+880)</option>
													<option data-countrycode="BB" value={'+1246'}>BB (+1246)</option>
													<option data-countrycode="BY" value={'+375'}>BY (+375)</option>
													<option data-countrycode="BE" value={'+32'}>BE (+32)</option>
													<option data-countrycode="BZ" value={'+501'}>BZ (+501)</option>
													<option data-countrycode="BJ" value={'+229'}>BJ (+229)</option>
													<option data-countrycode="BM" value={'+1441'}>BM (+1441)</option>
													<option data-countrycode="BT" value={'+975'}>BT (+975)</option>
													<option data-countrycode="BO" value={'+591'}>BO (+591)</option>
													<option data-countrycode="BA" value={'+387'}>BA (+387)</option>
													<option data-countrycode="BW" value={'+267'}>BW (+267)</option>
													<option data-countrycode="BR" value={'+55'}>BR (+55)</option>
													<option data-countrycode="BN" value={'+673'}>BN (+673)</option>
													<option data-countrycode="BG" value={'+359'}>BG (+359)</option>
													<option data-countrycode="BF" value={'+226'}>BF (+226)</option>
													<option data-countrycode="BI" value={'+257'}>BI (+257)</option>
													<option data-countrycode="KH" value={'+855'}>KH (+855)</option>
													<option data-countrycode="CM" value={'+237'}>CM (+237)</option>
													<option data-countrycode="CA" value={'+1'}>CA (+1)</option>
													<option data-countrycode="CV" value={'+238'}>CV (+238)</option>
													<option data-countrycode="KY" value={'+1345'}>KY (+1345)</option>
													<option data-countrycode="CF" value={'+236'}>CF (+236)</option>
													<option data-countrycode="CL" value={'+56'}>CL (+56)</option>
													<option data-countrycode="CN" value={'+86'}>CN (+86)</option>
													<option data-countrycode="CO" value={'+57'}>CO (+57)</option>
													<option data-countrycode="KM" value={'+269'}>KM (+269)</option>
													<option data-countrycode="CG" value={'+242'}>CG (+242)</option>
													<option data-countrycode="CK" value={'+682'}>CK (+682)</option>
													<option data-countrycode="CR" value={'+506'}>CR (+506)</option>
													<option data-countrycode="HR" value={'+385'}>HR (+385)</option>
													<option data-countrycode="CU" value={'+53'}>CU (+53)</option>
													<option data-countrycode="CY" value={'+90392'}>CY (North)(+90392)</option>
													<option data-countrycode="CY" value={'+357'}>CY (South)(+357)</option>
													<option data-countrycode="CZ" value={'+42'}>CZ (+42)</option>
													<option data-countrycode="DK" value={'+45'}>DK (+45)</option>
													<option data-countrycode="DJ" value={'+253'}>DJ (+253)</option>
													<option data-countrycode="DM" value={'+1809'}>DM (+1809)</option>
													<option data-countrycode="DO" value={'+1809'}>DO (+1809)</option>
													<option data-countrycode="EC" value={'+593'}>EC (+593)</option>
													<option data-countrycode="EG" value={'+20'}>EG (+20)</option>
													<option data-countrycode="SV" value={'+503'}>SV (+503)</option>
													<option data-countrycode="GQ" value={'+240'}>GQ (+240)</option>
													<option data-countrycode="ER" value={'+291'}>ER (+291)</option>
													<option data-countrycode="EE" value={'+372'}>EE (+372)</option>
													<option data-countrycode="ET" value={'+251'}>ET (+251)</option>
													<option data-countrycode="FK" value={'+500'}>FK (+500)</option>
													<option data-countrycode="FO" value={'+298'}>FO (+298)</option>
													<option data-countrycode="FJ" value={'+679'}>FJ (+679)</option>
													<option data-countrycode="FI" value={'+358'}>FI (+358)</option>
													<option data-countrycode="FR" value={'+33'}>FR (+33)</option>
													<option data-countrycode="GF" value={'+594'}>GF (+594)</option>
													<option data-countrycode="PF" value={'+689'}>PF (+689)</option>
													<option data-countrycode="GA" value={'+241'}>GA (+241)</option>
													<option data-countrycode="GM" value={'+220'}>GM (+220)</option>
													<option data-countrycode="GE" value={'+7880'}>GE (+7880)</option>
													<option data-countrycode="DE" value={'+49'}>DE (+49)</option>
													<option data-countrycode="GH" value={'+233'}>GH (+233)</option>
													<option data-countrycode="GI" value={'+350'}>GI (+350)</option>
													<option data-countrycode="GR" value={'+30'}>GR (+30)</option>
													<option data-countrycode="GL" value={'+299'}>GL (+299)</option>
													<option data-countrycode="GD" value={'+1473'}>GD (+1473)</option>
													<option data-countrycode="GP" value={'+590'}>GP (+590)</option>
													<option data-countrycode="GU" value={'+671'}>GU (+671)</option>
													<option data-countrycode="GT" value={'+502'}>GT (+502)</option>
													<option data-countrycode="GN" value={'+224'}>GN (+224)</option>
													<option data-countrycode="GW" value={'+245'}>GW (+245)</option>
													<option data-countrycode="GY" value={'+592'}>GY (+592)</option>
													<option data-countrycode="HT" value={'+509'}>HT (+509)</option>
													<option data-countrycode="HN" value={'+504'}>HN (+504)</option>
													<option data-countrycode="HK" value={'+852'}>HK (+852)</option>
													<option data-countrycode="HU" value={'+36'}>HU (+36)</option>
													<option data-countrycode="IS" value={'+354'}>IS (+354)</option>
													<option data-countrycode="ID" value={'+62'}>ID (+62)</option>
													<option data-countrycode="IR" value={'+98'}>IR (+98)</option>
													<option data-countrycode="IQ" value={'+964'}>IQ (+964)</option>
													<option data-countrycode="IE" value={'+353'}>IE (+353)</option>
													<option data-countrycode="IL" value={'+972'}>IL (+972)</option>
													<option data-countrycode="IT" value={'+39'}>IT (+39)</option>
													<option data-countrycode="JM" value={'+1876'}>JM (+1876)</option>
													<option data-countrycode="JP" value={'+81'}>JP (+81)</option>
													<option data-countrycode="JO" value={'+962'}>JO (+962)</option>
													<option data-countrycode="KZ" value={'+7'}>KZ (+7)</option>
													<option data-countrycode="KE" value={'+254'}>KE (+254)</option>
													<option data-countrycode="KI" value={'+686'}>KI (+686)</option>
													<option data-countrycode="KP" value={'+850'}>KP (+850)</option>
													<option data-countrycode="KR" value={'+82'}>KR (+82)</option>
													<option data-countrycode="KW" value={'+965'}>KW (+965)</option>
													<option data-countrycode="KG" value={'+996'}>KG (+996)</option>
													<option data-countrycode="LA" value={'+856'}>LA (+856)</option>
													<option data-countrycode="LV" value={'+371'}>LV (+371)</option>
													<option data-countrycode="LB" value={'+961'}>LB (+961)</option>
													<option data-countrycode="LS" value={'+266'}>LS (+266)</option>
													<option data-countrycode="LR" value={'+231'}>LR (+231)</option>
													<option data-countrycode="LY" value={'+218'}>LY (+218)</option>
													<option data-countrycode="LI" value={'+417'}>LI (+417)</option>
													<option data-countrycode="LT" value={'+370'}>LT (+370)</option>
													<option data-countrycode="LU" value={'+352'}>LU (+352)</option>
													<option data-countrycode="MO" value={'+853'}>MO (+853)</option>
													<option data-countrycode="MK" value={'+389'}>MK (+389)</option>
													<option data-countrycode="MG" value={'+261'}>MG (+261)</option>
													<option data-countrycode="MW" value={'+265'}>MW (+265)</option>
													<option data-countrycode="MY" value={'+60'}>MY (+60)</option>
													<option data-countrycode="MV" value={'+960'}>MV (+960)</option>
													<option data-countrycode="ML" value={'+223'}>ML (+223)</option>
													<option data-countrycode="MT" value={'+356'}>MT (+356)</option>
													<option data-countrycode="MH" value={'+692'}>MH (+692)</option>
													<option data-countrycode="MQ" value={'+596'}>MQ (+596)</option>
													<option data-countrycode="MR" value={'+222'}>MR (+222)</option>
													<option data-countrycode="YT" value={'+269'}>YT (+269)</option>
													<option data-countrycode="MX" value={'+52'}>MX (+52)</option>
													<option data-countrycode="FM" value={'+691'}>FM (+691)</option>
													<option data-countrycode="MD" value={'+373'}>MD (+373)</option>
													<option data-countrycode="MC" value={'+377'}>MC (+377)</option>
													<option data-countrycode="MN" value={'+976'}>MN (+976)</option>
													<option data-countrycode="MS" value={'+1664'}>MS (+1664)</option>
													<option data-countrycode="MA" value={'+212'}>MA (+212)</option>
													<option data-countrycode="MZ" value={'+258'}>MZ (+258)</option>
													<option data-countrycode="MN" value={'+95'}>MM (+95)</option>
													<option data-countrycode="NA" value={'+264'}>NA (+264)</option>
													<option data-countrycode="NR" value={'+674'}>NR (+674)</option>
													<option data-countrycode="NP" value={'+977'}>NP (+977)</option>
													<option data-countrycode="NL" value={'+31'}>NL (+31)</option>
													<option data-countrycode="NC" value={'+687'}>NC (+687)</option>
													<option data-countrycode="NZ" value={'+64'}>NZ (+64)</option>
													<option data-countrycode="NI" value={'+505'}>NI (+505)</option>
													<option data-countrycode="NE" value={'+227'}>NE (+227)</option>
													<option data-countrycode="NG" value={'+234'}>NG (+234)</option>
													<option data-countrycode="NU" value={'+683'}>NU (+683)</option>
													<option data-countrycode="NF" value={'+672'}>NF (+672)</option>
													<option data-countrycode="NP" value={'+670'}>MP (+670)</option>
													<option data-countrycode="NO" value={'+47'}>NO (+47)</option>
													<option data-countrycode="OM" value={'+968'}>OM (+968)</option>
													<option data-countrycode="PW" value={'+680'}>PW (+680)</option>
													<option data-countrycode="PA" value={'+507'}>PA (+507)</option>
													<option data-countrycode="PG" value={'+675'}>PG (+675)</option>
													<option data-countrycode="PY" value={'+595'}>PY (+595)</option>
													<option data-countrycode="PE" value={'+51'}>PE (+51)</option>
													<option data-countrycode="PH" value={'+63'}>PH (+63)</option>
													<option data-countrycode="PL" value={'+48'}>PL (+48)</option>
													<option data-countrycode="PT" value={'+351'}>PT (+351)</option>
													<option data-countrycode="PR" value={'+1787'}>PR (+1787)</option>
													<option data-countrycode="QA" value={'+974'}>QA (+974)</option>
													<option data-countrycode="RE" value={'+262'}>RE (+262)</option>
													<option data-countrycode="RO" value={'+40'}>RO (+40)</option>
													<option data-countrycode="RU" value={'+7'}>RU (+7)</option>
													<option data-countrycode="RW" value={'+250'}>RW (+250)</option>
													<option data-countrycode="SM" value={'+378'}>SM (+378)</option>
													<option data-countrycode="ST" value={'+239'}>ST (+239)</option>
													<option data-countrycode="SA" value={'+966'}>SA (+966)</option>
													<option data-countrycode="SN" value={'+221'}>SN (+221)</option>
													<option data-countrycode="CS" value={'+381'}>CS (+381)</option>
													<option data-countrycode="SC" value={'+248'}>SC (+248)</option>
													<option data-countrycode="SL" value={'+232'}>SL (+232)</option>
													<option data-countrycode="SG" value={'+65'}>SG (+65)</option>
													<option data-countrycode="SK" value={'+421'}>SK (+421)</option>
													<option data-countrycode="SI" value={'+386'}>SI (+386)</option>
													<option data-countrycode="SB" value={'+677'}>SB (+677)</option>
													<option data-countrycode="SO" value={'+252'}>SO (+252)</option>
													<option data-countrycode="ZA" value={'+27'}>ZA (+27)</option>
													<option data-countrycode="ES" value={'+34'}>ES (+34)</option>
													<option data-countrycode="LK" value={'+94'}>LK (+94)</option>
													<option data-countrycode="SH" value={'+290'}>SH (+290)</option>
													<option data-countrycode="KN" value={'+1869'}>KN (+1869)</option>
													<option data-countrycode="SC" value={'+1758'}>LC (+1758)</option>
													<option data-countrycode="SR" value={'+597'}>SR (+597)</option>
													<option data-countrycode="SD" value={'+249'}>SD (+249)</option>
													<option data-countrycode="SZ" value={'+268'}>SZ (+268)</option>
													<option data-countrycode="SE" value={'+46'}>SE (+46)</option>
													<option data-countrycode="CH" value={'+41'}>CH (+41)</option>
													<option data-countrycode="SI" value={'+963'}>SY (+963)</option>
													<option data-countrycode="TW" value={'+886'}>TW (+886)</option>
													<option data-countrycode="TJ" value={'+7'}>TJ (+7)</option>
													<option data-countrycode="TH" value={'+66'}>TH (+66)</option>
													<option data-countrycode="TG" value={'+228'}>TG (+228)</option>
													<option data-countrycode="TO" value={'+676'}>TO (+676)</option>
													<option data-countrycode="TT" value={'+1868'}>TT (+1868)</option>
													<option data-countrycode="TN" value={'+216'}>TN (+216)</option>
													<option data-countrycode="TR" value={'+90'}>TR (+90)</option>
													<option data-countrycode="TM" value={'+7'}>TM (+7)</option>
													<option data-countrycode="TM" value={'+993'}>TM (+993)</option>
													<option data-countrycode="TC" value={'+1649'}>TC (+1649)</option>
													<option data-countrycode="TV" value={'+688'}>TV (+688)</option>
													<option data-countrycode="UG" value={'+256'}>UG (+256)</option>
													<option data-countrycode="UA" value={'+380'}>UA (+380)</option>
													<option data-countrycode="AE" value={'+971'}>AE (+971)</option>
													<option data-countrycode="UY" value={'+598'}>UY (+598)</option>
													<option data-countrycode="UZ" value={'+7'}>UZ (+7)</option>
													<option data-countrycode="VU" value={'+678'}>VU (+678)</option>
													<option data-countrycode="VA" value={'+379'}>VA (+379)</option>
													<option data-countrycode="VE" value={'+58'}>VE (+58)</option>
													<option data-countrycode="VN" value={'+84'}>VN (+84)</option>
													<option data-countrycode="VG" value={'+1284'}>VG (+1284)</option>
													<option data-countrycode="VI" value={'+1340'}>VI (+1340)</option>
													<option data-countrycode="WF" value={'+681'}>WF (+681)</option>
													<option data-countrycode="YE" value={'+969'}>YE (+969)</option>
													<option data-countrycode="YE" value={'+967'}>YE (+967)</option>
													<option data-countrycode="ZM" value={'+260'}>ZM (+260)</option>
													<option data-countrycode="ZW" value={'+263'}>ZW (+263)</option>
												</select>
                        
                      </span>
                      <span>
                        <input
                          type="text"
                          name="PhoneNumber_countrycode"
                          value={formData.phone}
                          onChange={(e)=> setFormData({...formData, phone:e.target.value})}
                          maxLength={20}
                          placeholder="Phone No."
                          id="international_PhoneNumber_countrycode"
                          check-type="c7"
                          val-type="number"
                          field-type="11"
                          phone-format="1"
                          is-countrycodeenabled="true"
                          phone-formattype="1"
                        />
                       
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                    {errors.phone && <p id="PhoneNumber_error" className="zf-errorMessage">
                      Invalid value
                    </p>}
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Dropdown */}
                <li className="zf-tempFrmWrapper zf-large">
                  
                  <div className="zf-tempContDiv">
                    <select
                      className="zf-form-sBox"
                      name="Dropdown"
                      value={formData.service}
                      onChange={(e)=>setFormData({...formData, service:e.target.value})}
                      check-type="c1"
                      aria-placeholder='-select-'
                    >
                      <option value="-Select-">-Select-</option>
                      {[
                        'Andaman and Nicobar Islands',
                        'Andhra Pradesh',
                        'Arunachal Pradesh',
                        'Assam',
                        'Bihar',
                        'Chhattisgarh',
                        'Delhi',
                        'Gujarat',
                        'Haryana',
                        'Goa',
                        'Himachal Pradesh',
                        'Jammu and Kashmir',
                        'Jharkhand',
                        'Karnataka',
                        'Kerala',
                        'Madhya Pradesh',
                        'Maharashtra',
                        'Manipur',
                        'Meghalaya',
                        'Mizoram',
                        'Nagaland',
                        'Odisha',
                        'Puducherry',
                        'Punjab',
                        'Rajasthan',
                        'Sikkim',
                        'Tamil Nadu',
                        'Tripura',
                        'Uttar Pradesh',
                        'Uttarakhand',
                        'Telangana',
                        'West Bengal',
                        'Chandigarh',
                        'Dadar and Nagar Haveli',
                        'Daman and Diu',
                        'Lakshadweep',
                      ].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p id="Dropdown_error" className="zf-errorMessage">
                      Invalid value
                    </p>}
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>
              </ul>
            </div>

            <ul>
              <li className="zf-fmFooter">
                <button className="zf-submitColor" type="submit">
                  Get Your Quotation Now!
                </button>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
   </>
  );
};

export default AppRegisterkaroForm;

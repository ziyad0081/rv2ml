/* eslint-disable no-unused-vars */
import { useState } from "react";
import instructions from '../../../instructions.json'

let colors = {
    "inst":"text-sky-500 hover:bg-sky-500 ",
    "rd":"text-green-500 hover:bg-green-500",
    "rs1":"text-red-400 hover:bg-red-400",
    "rs2":"text-fuchsia-500 hover:bg-fuchsia-500",
    "imm":"text-teal-600 hover:bg-teal-600",
    "shamt":"text-teal-600 hover:bg-teal-600",
}
let conversion_table = {
    "opcode":"inst",
    "fct3":"inst",
    "fct7":"inst",
    "rs1":"rs1",
    "rs2":"rs2",
    "rd":"rd",
    "imm[0:11]":"imm",
    "imm":"imm",
    "i[10:5]":"imm",
    "i[11:5]":"imm",
    "i[0:4]":"imm",
    "i[4:1]":"imm",
    "i[11]":"imm",
    "i[12]":"imm",
    "i[31:12]":"imm",
    "i[19:12]":"imm",
    "i[10:1]":"imm",
    "i[20]":"imm",
    "shamt":"imm"
}
function GetInstructionType(inst){
    for (const instructionType in instructions) {
        if (inst in instructions[instructionType]) {
          return instructionType;
        }
    }
}
function getSignedInteger(bits) {
    let negative = (bits[0] === '1');
    if (negative) {
        let inverse = '';
        for (let i = 0; i < bits.length; i++) {
            inverse += (bits[i] === '0' ? '1' : '0');
        }
        return (parseInt(inverse, 2) + 1) * -1;
    } else {
        return parseInt(bits, 2);
    }
}

function getRegisterRepFromName(register){
    return parseInt(register.slice(1)).toString(2).padStart("5","0")
}
function SignedIntegerInto2CP(decimal_str,length){
    let imm = parseInt(decimal_str,10)
        if (imm < 0) {
            imm = (imm >>> 0).toString(2).slice(-length);
        } else {
            imm = imm.toString(2).padStart(length, '0'); 
        }
    return imm
}
function UserForm(){
    const [instruction, setInstruction] = useState('')
    const [binaryInst , setBinary] = useState(null)
    const [RV32Inst , setRV32] = useState(null)
    const [Hex, setHex]=useState(null)
    const [instType , setType] = useState(null)
    const [hovered, setHovered] = useState({
        "inst":false,
        "rd":false,
        "rs1":false,
        "rs2":false,
        "imm":false,

    })
    function setHexadecimalFromJson(result_obj){
        let result = parseInt(Object.values(result_obj).reverse().join(''),2).toString(16).padStart(8,'0') 
        setHex(result)
    }
    function RV32IParserL(tokens){
        let original_imm = tokens[2]
        let operation = tokens[0]
        let rd = parseInt(tokens[1].slice(1)).toString(2).padStart(5,"0")
        let imm = parseInt(tokens[2],10)
        if (imm < 0) {
            imm = (imm >>> 0).toString(2).slice(-12);
        } else {
            imm = imm.toString(2).padStart(12, '0'); 
        }
        let rs1 = parseInt(tokens[3].slice(1)).toString(2).padStart(5,"0")
        let result = {
            "opcode":"",
            "rd":"",
            "fct3":"",
            "rs1":"",
            "imm[0:11]":""
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "imm[0:11]":"",
            "rs1":""
        }
        result["opcode"] = instructions["L"]["opcode"]
        result["fct3"] = instructions["L"][operation]["fct3"]
        result["rd"] = rd
        result["rs1"] = rs1
        result["imm[0:11]"] = imm
        rv32result["inst"] = tokens[0]
        rv32result.rd = tokens[1]+','
        rv32result.rs1 = '('+tokens[3]+')'
        rv32result["imm[0:11]"] = original_imm
        setBinary(result)
        
        setRV32(rv32result)
        setType("I")
        
        return result
    }
    function RV32IParserR(tokens){
        let operation = tokens[0]
        let rd  = parseInt(tokens[1].slice(1)).toString(2).padStart("5","0")
        let rs1  = parseInt(tokens[2].slice(1)).toString(2).padStart("5","0")
        let rs2  = parseInt(tokens[3].slice(1)).toString(2).padStart("5","0")
        let result = {
            "opcode":"",
            "rd":"",
            "fct3":"",
            "rs1":"",
            "rs2":"",
            "fct7":"",
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "rs1":"",
            "rs2":""
        }
        result["opcode"] = instructions["R"]["opcode"]
        result["fct3"] = instructions["R"][operation]["fct3"]
        result["fct7"] = instructions["R"][operation]["fct7"]
        result["rd"] = rd
        result["rs1"] = rs1
        result["rs2"] = rs2        
        rv32result.inst = tokens[0]
        rv32result.rd = tokens[1]+','
        rv32result.rs1 = tokens[2]+','
        rv32result.rs2 = tokens[3]
        setRV32(rv32result)
        setBinary(result)
        setType("R")
        
        return result
    }
    function RV32IParserI(tokens){
        
        let operation = tokens[0]
        let rd = getRegisterRepFromName(tokens[1])
        let rs1 = getRegisterRepFromName(tokens[2])
        let imm = parseInt(tokens[3],10)
        if (imm < 0) {
            imm = (imm >>> 0).toString(2).slice(-12);
        } else {
            imm = imm.toString(2).padStart(12, '0'); 
        }

        let result = {
            "opcode":"",
            "rd":"",
            "fct3":"",
            "rs1":"",
            "imm[0:11]":""
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "rs1":"",
            "imm[0:11]":""
        }
        result["opcode"] = instructions["I"]["opcode"] 
        result["fct3"] = instructions["I"][operation]["fct3"]
        result["rd"] = rd
        result["rs1"] = rs1
        result["imm[0:11]"] = imm

        rv32result.inst = tokens[0]
        rv32result.rd = tokens[1]+','
        rv32result.rs1 = tokens[2]+','
        rv32result["imm[0:11]"] = tokens[3]
        setRV32(rv32result)
        setBinary(result)
        setType("I")
        
        return result
    }
    function RV32IParserIJ(tokens){
        
        let operation = tokens[0]
        let rd = getRegisterRepFromName(tokens[1])
        let rs1 = getRegisterRepFromName(tokens[3])
        let imm = SignedIntegerInto2CP(tokens[2],12)

        let result = {
            "opcode":"",
            "rd":"",
            "fct3":"",
            "rs1":"",
            "imm[0:11]":""
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "imm":"",
            "rs1":""
            
        }

        result["opcode"] = instructions["IJ"]["opcode"] 
        result["fct3"] = instructions["IJ"][operation]["fct3"]
        result["rd"] = rd
        result["rs1"] = rs1
        result["imm[0:11]"] = imm

        rv32result.inst = tokens[0]
        rv32result.rd = tokens[1]+','
        rv32result.rs1 = '('+tokens[3]+')'
        rv32result["imm"] = getSignedInteger(imm)
        setRV32(rv32result)
        setBinary(result)
        setType("I")
        
        return result
    }
    function RV32IParserIS(tokens){
        let operation = tokens[0]
        let rd = getRegisterRepFromName(tokens[1])
        let rs1 = getRegisterRepFromName(tokens[2])
        let imm = parseInt(tokens[3],10)
        if (imm < 0) {
            imm = (imm >>> 0).toString(2).slice(-5);
        } else {
            imm = imm.toString(2).padStart(5, '0').slice(-5); 
        }

        let result = {
            "opcode":"",
            "rd":"",
            "fct3":"",
            "rs1":"",
            "shamt":"",
            "fct7":""
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "rs1":"",
            "shamt":""
        }
        result["opcode"] = instructions["IS"]["opcode"] 
        result["fct3"] = instructions["IS"][operation]["fct3"]
        result["rd"] = rd
        result["rs1"] = rs1
        result["shamt"] = imm
        result["fct7"] = instructions["IS"][operation]["fct7"]

        rv32result.inst = tokens[0]
        rv32result.rd = tokens[1]+','
        rv32result.rs1 = tokens[2]+','
        rv32result["shamt"] = tokens[3]
        setRV32(rv32result)
        setBinary(result)
        setType("I")
        
        return result
    }
    function RV32IParserB(tokens){
        let result = {
            "opcode":"",
            "i[11]":"",
            "i[4:1]":"",
            "fct3":"",
            "rs1":"",
            "rs2":"",
            "i[10:5]":"",
            "i[12]":""
        }
        let rv32result = {
            "inst":"",
            "rs1":"",
            "rs2":"",
            "imm":"",
        }

        let operation = tokens[0]
        let rs1 = getRegisterRepFromName(tokens[1])
        let rs2 = getRegisterRepFromName(tokens[2])
        let imm = parseInt(tokens[3],10)
        if (imm < 0) {
            imm = (imm >>> 0).toString(2).slice(-13);
        } else {
            imm = imm.toString(2).padStart(13, '0'); 
        }

        let real_val = imm.substring(0,12)+"0"
        
        
        result.opcode = instructions.B.opcode
        result.rs1 = rs1
        result.rs2 = rs2
        result.fct3 = instructions.B[operation].fct3
        result["i[11]"]=imm[1]
        result["i[4:1]"]=imm.slice(8,12)
        result["i[10:5]"]=imm.slice(2,8)
        result["i[12]"]=imm[0]


        rv32result.inst = tokens[0]
        rv32result.rs1 = tokens[1]+","
        rv32result.rs2 = tokens[2]+","
        rv32result.imm = parseInt(real_val,2)


        
        setType("B")
        setBinary(result)
        setRV32(rv32result)
        
        return result

    }
    function RV32IParserS(tokens){
        let result = {
            "opcode":"",
            "i[0:4]":"",
            "fct3":"",
            "rs1":"",
            "rs2":"",
            "i[11:5]":"",
        }
        let rv32result = {
            "inst":"",
            
            "rs2":"",
            "imm":"",
            "rs1":"",
        }

        let operation = tokens[0]
        let rs1 = getRegisterRepFromName(tokens[3])
        let rs2 = getRegisterRepFromName(tokens[1])
        let imm = SignedIntegerInto2CP(tokens[2],12)
        let dec_imm_val = getSignedInteger(imm)
        result.opcode = instructions.S.opcode
        result.rs1 = rs1
        result.rs2 = rs2
        result.fct3 = instructions.S[operation].fct3
        result["i[0:4]"]=imm.slice(7,12)
        result["i[11:5]"]=imm.slice(0,7)

        rv32result.inst = tokens[0]
        
        rv32result.rs2 = tokens[1]+","
        rv32result.imm = dec_imm_val
        rv32result.rs1 = '('+tokens[3]+')'
        

        setType("S")
        setBinary(result)
        setRV32(rv32result)
        
        return result

    }
    function RV32IParserU(tokens){
        let result = {
            "opcode":"",
            "rd":"",
            "i[31:12]":"",
        }
        let rv32result = {
            "inst":"",
            "rd":"",
            "imm":""
        }

        let operation = tokens[0]
        let rd = getRegisterRepFromName(tokens[1])
        let imm = SignedIntegerInto2CP(tokens[2],20)
        

        result.opcode = instructions.U[operation].opcode
        result.rd = rd
        result["i[31:12]"] = imm

        rv32result.inst = tokens[0]
        rv32result.rd = tokens[1] + ','
        rv32result.imm = getSignedInteger(imm)
        setType("U")
        setBinary(result)
        setRV32(rv32result)
        return result

    }
    function RV32IParserJ(tokens){
        let result = {
            "opcode":"",
            "rd":"",
            "i[19:12]":"",
            "i[11]":"",
            "i[10:1]":"",
            "i[20]":""
        }
        let rv32result = {
            "inst": "",
            "rd" : "",
            "imm" : ""
        }
        
        let imm = SignedIntegerInto2CP(tokens[2],21)
        let rd = getRegisterRepFromName(tokens[1])
        let real_val = imm.substring(0,20)+"0"
        console.log(imm[8]);
        result.opcode = instructions.J.jal.opcode
        result["i[20]"] = imm[0]
        result["i[10:1]"] = imm.substring(10,20)
        result["i[11]"] = imm[20-11]
        result["i[19:12]"]=imm.substring(20-19,20-11)
        result["rd"] = rd
        rv32result.inst = tokens[0]
        rv32result.imm = getSignedInteger(real_val)
        rv32result.rd = tokens[1] + ','

        setBinary(result)
        setRV32(rv32result)
        setType("J")

        return result
    }
    function FragmentForLoadStore(tokens){
        let last = tokens.pop()
        tokens.push(last.split(/\(/)[0])        
        tokens.push(last.split(/\(/)[1].slice(0,-1))
        return tokens
    }
    function RV32IParser(tokens,inst_type){
        
        switch (inst_type) {
            case "L":
                // eslint-disable-next-line no-case-declarations
                tokens = FragmentForLoadStore(tokens)
                return RV32IParserL(tokens);
            case "I":
                return RV32IParserI(tokens);
            case "IJ":
                tokens = FragmentForLoadStore(tokens)
                return RV32IParserIJ(tokens);
            case "IS":
                return RV32IParserIS(tokens);
            case "R":
                return RV32IParserR(tokens);
            case "B":
                return RV32IParserB(tokens);
            case "S":
                tokens = FragmentForLoadStore(tokens)
                console.log(tokens)
                return RV32IParserS(tokens);
            case "U":
                return RV32IParserU(tokens);
            case "J":
                return RV32IParserJ(tokens);
            default:
                break;
        }
        
    }

    
    function HandleUserConfirm(event){
        if(event.key == 'Enter'){
        // tokenize instruction
        let str = event.target.value
        let tokens = str.split(/[ ,]+/).map(token => token.trim());
        //after that we pass it to parser
        //now we check what type is the instruction
        let inst_type = GetInstructionType(tokens[0])
        let res = RV32IParser(tokens,inst_type)
        setHexadecimalFromJson(res)
        
        
        }
    }
    return(
        <div className="  rounded-xl  w-1/2 h-3/4 p-2 flex flex-col items-center ">
            <div className="flex-col flex relative w-full items-center">
                <label htmlFor="instruction" className="text-sm bg-raisin absolute  px-1">RV32I Instruction</label>
                <input type="text" name="instruction" value={instruction} className=" bg-transparent border-2 w-3/4  mt-2.5 rounded-xl p-2 border-peach focus:outline-none" onChange={(e)=>setInstruction(e.target.value)} onKeyDown={HandleUserConfirm}/>

            </div>
            <div className="relative cursor-pointer flex flex-col justify-evenly rounded-xl border-2 border-peach mt-8 w-3/4 p-2 h-full">
                <span className="text-sm bg-raisin px-1 absolute -top-3 "> Conversion </span>
                <h1>Instruction Type : {instType && instType + "-Type"} </h1>
                <div>
                <h1>Binary String :</h1> 

                {
                binaryInst && 
                <div className="flex justify-center mt-4">
                    
                    {   
                     
                        Object.keys(binaryInst).reverse().map((key,i)=>(<span key={i} className={colors[conversion_table[key]] + " hover:text-raisin p-1 rounded-xl transition-all ease-in text-center"} title={key}>{binaryInst[key]}</span>))
                    }
                    
                </div>
                }

                </div>
                <h1>RV32I Instruction : </h1>
                {
                binaryInst && 
                <div className="flex justify-center ">
                    
                    {   
                     
                        Object.keys(RV32Inst).map((key,i)=>(<span key={i} className={colors[key] + " rounded-xl hover:text-raisin p-1 transition-all ease-in text-center"} title={key}>{RV32Inst[key]}</span>))
                    }
                    
                </div>
                }
                <h1>Hexadecimal :</h1>
                {
                Hex && 
                <div className=" text-center ">
                    <span className=" w-fit text-hex hover:bg-hex hover:text-raisin p-1 rounded-xl transition-all ease-in"> 0x{Hex}</span>
                </div>
                }
            </div>
        </div>
    )
}

export default UserForm;
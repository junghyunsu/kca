# BX CODE Sample

## 시연 프로젝트에 포함된 내용
> Bean, Service 코드 설명 및 잠재적인 문제 찾기, JavaDoc 생성을 위한 기본이 되는 소스를 프로젝트로 작성하여 제공한다.
기존에 작성된 서비스는 직원번호를 입력받아 직원 정보를 조회하는 서비스로 구현되었다.
시연은 기존 소스 내용을 확인하고, 직원정보를 추가하는 서비스를 하나 더 추가하는 시나리오이다.

## 시연 순서
### 서비스 생성하기

1. 코드 설명하기 (SSmpEmpTst1001A.java)
    java 파일을 열고 ssmpemptst1001a001메소드를 선택한 후 Alt+Enter를 이용해  코드 설명을 테스트한다.


2. 코드 생성하기 (SSmpEmpTst1001A.java)
코드 가장 끝의 주석에서 새로운 오퍼레이션 작성을 위하여 Alt+\ 를 통해 새로운 서비스 코드를 생성한다.

    ```java
    //직원정보를 추가하고 처리건수를 담은 출력 데이터 객체를 반환하는 서비스 오퍼레이션
    ```

    서비스 오퍼레이션 등의 annotation 정보가 정상적으로 입력되어있으며, 에러 처리시 DefaultApplicationException을 이용하고 있다.
    ```java
    bean.addSmpEmpTst(beanInput);
    ```
    이 부분이 존재하지 않아 에러가 발생하므로 해당 소스 작성을 위해 bean으로 이동한다.

3. bean에서 메소드 생성  (MSmpEmpTstBean001.java)
    Alt+\를 사용해 코드를 완성한다.
   
    ```java
    //직원정보를 추가하고 처리건수를 반환하는 메소드
    ```
    
      
	
4. 위와 비슷한 코드가 생성되면 input 검증 이후에 email 검증 완성을 주석으로 추가하고 부분코드를 생성한다.
    ```java
    /**
		 * @BXMType IF
		 * @Desc 입력 검증 : 필수 입력 값 검증 코드를 작성 하십시오.
		 */
		if (input == null) {
			throw new DefaultApplicationException("BXMAD0006", new Object[] { "입력 매개변수가 null입니다." });
		} else if (input.getFeduDeptNo() == null) {
			throw new DefaultApplicationException("BXMAD0006", new Object[] { "부서 번호가 null입니다." });
		}
		//직원 이메일 검증
    ```
    
5. javadoc 생성
    validateInput에 커서를 두고 Alt+Enter를 사용하여 javadoc을 생성한다.


6. 메소드 이름 변경
validateInput메소드에 커서를 두고 Alt+Enter를 사용하여 메소드 이름 제안을 받아 변경한다.
메소드 이름이 변경되며, validateInput를 호출하고 있는 부분도 함께 변경된다.
7. 변수명 변경
코드 내에서 사용중인 변수 위에 Alt +Enter를 사용하여 변수명 제안을 받아 변경한다.
8. commit massage 생성
   Git staging view에서 수정된 파일을 index에 추가하고 커밋 메시지 생성 버튼을 클릭한다.
   
    ```
    새로운 서비스 오퍼레이션 및 메소드 추가
    - 새로운 서비스 오퍼레이션 ssmpemptst1001a002 추가
    - 새로운 메소드 addSmpEmpTst 추가
    ```

### 리팩토링 , 문제찾기
9. 리팩토링 및 문제 찾기 (bxcodesmp.com.sample.test.MemoryExample.java)
    메모리 누수의 문제가 있는 코드로 아래 코드를 추가하도록 안내한다.
    
    - equals(), hashCode()를 구현하지 않아 map사용시 누수 발생.
    
    
### Chat 기능의 시연

- 정규식과 관련된 질문
  * 정규식을 사용하여 전화번호 형식을 검증하는 방법을 알려줘


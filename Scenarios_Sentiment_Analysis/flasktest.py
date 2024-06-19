import requests
import json

# Flask 애플리케이션의 엔드포인트 URL
url = 'http://127.0.0.1:6000/analyze'

# 테스트에 사용할 임의의 데이터
data = {
    'title': '라푼젤',
    'text': '''라푼첼

1. 프롤로그.

-1. 한 부부의 집.

오랫동안 아무런 결실 없이 아이를 원하기만 한 부부가 있었습니다. 그 부부의 집 뒤채에는 제일 예쁜 꽃과 식물들로 가득 찬 정원을 볼 수 있는 작은 창문이 있었습니다. 하지만 그 정원은 높은 벽으로 둘러 쌓여있었고 아무도 감히 들어갈 수 없었습니다. 왜냐하면, 그 정원은 전 세계 모두가 무서워하고 엄청난 힘을 가진 마녀의 것이기 때문이었습니다. 어느 날 부인은 창문 가에 서서 정원에 있는 화단을 보았습니다. 그 화단에 라푼첼(초롱꽃속의 식물)이 심겨 있었는데 선명한 초록색을 띠고 신선해 보여 그녀는 라푼첼을 매우 먹고 싶었습니다. 그 욕구는 날마다 커졌지만, 라푼첼을 먹을 수 없다는 사실 때문에 부인은 날마다 야위어 갔습니다. 그런 모습을 본 남편은 깜짝 놀라 물었습니다.

남편 : 깜짝이야! 무슨 일이야? 여보!
부인 : 만약 내가 우리 집 뒤에 정원에서 먹을 라푼첼을 얻지 못하면 난 죽을 거 에요.
남편 : 어떤 위험이 있더라도 내 아내를 죽게 내버려 두기보다는 라푼첼을 가져오겠어.

-2. 마녀의 정원.

그래서 남편은 황혼에 마녀의 정원에 벽을 넘어들어갔습니다. 그리고는 황급히 한 줌의 라푼첼을 가져와 부인에게 주었습니다. 그녀는 라푼첼로 샐러드를 만들었습니다. 하지만 그 샐러드가 매우 맛있어서 날이 갈수록 라푼첼을 먹고 싶은 욕구가 커졌습니다. 부인이 안정을 찾기 위해서는 남편이 한 번 더 정원에 올라가야 했습니다. 그는 황혼에 다시 정원의 벽을 올라갔고 그 순간, 그는 놀랐습니다. 그 앞에 서 있는 마녀를 보았기 때문입니다.

마녀 : 어떻게 네가 감히 내 정원에 도둑처럼 들어와 라푼첼을 훔칠 수 있느냐! 괘씸한 것.
남편 : 죄송합니다. 자비를 베풀어 용서해 주세요.
부인 : 제발 용서해 주세요. 남편은 나를 위해 라푼첼을 가져왔어요.
마녀 : 흠, 네가 말한 그런 상황이라면 너희가 필요한 만큼의 라푼첼을 먹을 수 있게 해주겠어. 하지만 조건이 있지. 너희 부부는 나에게 한 아이를 나에게 줘야 해. 다만 그 아이는 네 아내가 낳은 아이여야 해. 그 아이는 잘 자랄 거고 내가 엄마처럼 잘 보살펴주지.

2. 라푼첼이 사는 탑.

-1. 탑. 몇 년 후.

머리카락이 내려왔고 왕자는 위로 올라갔습니다. 처음에 왕자가 그녀 앞으로 왔을 때, 그녀는 깜짝 놀랐습니다. 그러자 그는 라푼첼의 노래가 그의 심장을 뛰게 했고 그를 너무 혼란스럽게 만들어 그녀를 보지 않고는 안 될 것 같아 이곳에 왔다고 말했습니다. 그래서 라푼첼은 두려움을 잊었습니다.왕자가 그녀에게 자신을 남편으로 받아주겠느냐고 물어봤을 때, 그녀는 '그가 고텔 엄마(마녀)보다 날 더 사랑해 줄 거야.'라고 생각했고 그의 손을 잡았습니다. 그녀는 말했습니다.

라푼첼 : 당신과 함께 가겠어요. 하지만 여기서 어떻게 나가야 할지 모르겠어요. 당신이 여기 올 때 비단을 갖고 오시면 제가 그걸로 사다리를 만들게요. 사다리가 완성되면 내가 내려갈 테니 당신이 나를 말 위로 태워주세요.
라푼첼 : 어떻게 나에게 한눈에 반한 왕자보다 당신이 더 무거울 수가 있죠?
마녀 : 이런 간사한것!
마녀 : 지금 무슨 소릴 하는 거야! 나는 너를 세상과 완전히 단절시켰다고 생각했는데. 넌 날 배신한 거였어!'''
}

# JSON 데이터를 POST 요청으로 전송
response = requests.post(url, json=data)

# 응답 결과 출력
print('응답 코드:', response.status_code)
print('응답 본문:', response.json())
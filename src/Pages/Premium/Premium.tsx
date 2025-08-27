import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions"
import Hero from "./Hero"
import Offers from "./Offers"
import ToggleSwitch from "./TogglSwitch"

const Premium = () => {
  return (
    <>
    <div className="w-full h-full flex items-center justify-center flex-col overflow-hidden ">
    <Hero/>
    <ToggleSwitch/>
    <Offers/>
    <FrequentlyAskedQuestions/>

    </div>
    </>
  )
}

export default Premium
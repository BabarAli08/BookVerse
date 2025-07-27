
import FreeCard from './FreeCard'

const Pricing = () => {
  return (
     <div className="flex items-center gap-4 justify-center p-4 w-full h-[50%]">
      <FreeCard
        yes={[
          "Access to 1,000+ free books",
          "Basic reading features",
          "Mobile app access",
          "Community discussions",
        ]}
        no={[
          "Limited book selection",
          "Ads between chapters",
          "No offline downloads",
          "No premium features",
        ]}
        title="Get Started Free"
        price="$0"
        color="gray"
        heading="Perfect for casual readers"
        onClick={() => console.log("Free Card Clicked")}
        priceTitle="Free"
      />
      <div className="shadow-2xl mb-4">

      <FreeCard
     
        yes={[
          " Access to 50,000+ books",
          "Ad-free reading experience",
          "Unlimited offline downloads",
          "Premium reading features",
          "Audiobook access (5 per month)",
          "Priority customer support",
          "Reading analytics & insights",
          "Text highlighting & notes",
        ]}
        no={[]}
        title="Get Started Free"
        price="$9.99"
        color="purple"
        heading="For avid readers who want more"
        onClick={() => console.log("Free Card Clicked")}
        priceTitle="Premium"
      />
      </div>
      <FreeCard
        yes={[
          "Everything in Premium",
          "Unlimited audiobook access",
          "Early access to new releases",
          "Exclusive author content",
          "Advanced AI recommendations",
          "Multi-device sync",
          "Family sharing (up to 6 members)",
          "Personal reading coach",
          "Advanced highlighting & annotations",
          "Export notes & highlights",
        ]}
        no={[]}
        title="Choose Ultimate"
        price="$19.99"
        color="yellow"
        heading="The complete reading experience"
        onClick={() => console.log("Ultimate Clicked")}
        priceTitle="Ultimate"
      />
    </div>
  )
}

export default Pricing
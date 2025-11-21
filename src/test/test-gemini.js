const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
  "gemini-2.5-flash",
  "gemini-1.0-pro-latest",
  "gemini-pro",
];

async function testModels() {
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(
        'Say "Hello" in JSON format: {"message": "hello"}'
      );
      const response = await result.response;
      console.log(`✅ ${modelName}: SUCCESS`);
      console.log(`   Response: ${response.text().substring(0, 100)}...`);
      return modelName; // Return the first working model
    } catch (error) {
      console.log(`❌ ${modelName}: FAILED - ${error.message}`);
    }
  }
  return null;
}

testModels().then((workingModel) => {
  if (workingModel) {
    console.log(`\n🎉 Use this model: ${workingModel}`);
  } else {
    console.log("\n💥 No models worked. Check your API key and region.");
  }
});

<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";

  // Form data
  let name = $state("");
  let email = $state("");
  let subject = $state("");
  let category = $state("");
  let question = $state("");
  let anonymous = $state(false);
  let agreeToTerms = $state(false);

  // Form submission handler
  function handleSubmit() {
    console.log({
      name,
      email,
      subject,
      category,
      question,
      anonymous,
      agreeToTerms,
    });

    // Reset form after submission (would be removed when server actions are added)
    name = "";
    email = "";
    subject = "";
    category = "";
    question = "";
    anonymous = false;
    agreeToTerms = false;

    // Show confirmation message
    alert("Your question has been submitted!");
  }

  // Categories
  const categories = [
    "Psychology",
    "Relationships",
    "Career",
    "Finance",
    "Health",
    "Technology",
    "Society",
    "Personal Growth",
  ];

  // Generate current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
</script>

<div class="container mx-auto p-4 mb-5 -rotate-1">
  <div class="prescription-container mx-auto">
    <!-- Prescription Header -->
    <div class="rx-header">
      <div>
        <div class="rx-symbol">Rx</div>
      </div>
      <div class="rx-title">
        <h1 class="font-bold">HARD PILL REQUEST</h1>
        <p class="text-sm">Seeking Difficult Truths</p>
      </div>
      <div class="rx-info">
        <p><span>DATE:</span> {formattedDate}</p>
      </div>
    </div>

    <!-- Prescription Form -->
    <form on:submit|preventDefault={handleSubmit} class="rx-form">
      <div class="rx-grid">
        <div class="rx-section">
          <Label for="name" class="rx-label">PATIENT NAME</Label>
          <Input
            id="name"
            placeholder="Your Name"
            bind:value={name}
            required={!anonymous}
          />
        </div>

        <div class="rx-section">
          <Label for="email" class="rx-label">CONTACT</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your Email"
            bind:value={email}
            required
          />
        </div>
      </div>

      <div class="rx-grid">
        <div class="rx-section">
          <Label for="subject" class="rx-label">SUBJECT</Label>
          <Input
            id="subject"
            placeholder="Brief subject line"
            bind:value={subject}
            required
          />
        </div>

        <div class="rx-section">
          <Label for="category" class="rx-label">CATEGORY</Label>
          <select
            id="category"
            class="rx-select"
            bind:value={category}
            required
          >
            <option value="" disabled selected>Select</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="rx-section">
        <Label for="question" class="rx-label">DESCRIBE YOUR SITUATION</Label>
        <Textarea
          id="question"
          placeholder="What difficult truth are you seeking? Describe your situation in detail..."
          bind:value={question}
          rows="4"
          required
        />
      </div>

      <div class="rx-line"></div>

      <div class="rx-checkboxes">
        <div class="flex items-center space-x-3">
          <Checkbox id="anonymous" bind:checked={anonymous} />
          <Label for="anonymous" class="text-sm">
            I want to remain anonymous if my question is featured
          </Label>
        </div>

        <div class="flex items-center space-x-3 mt-2">
          <Checkbox id="terms" bind:checked={agreeToTerms} required />
          <Label for="terms" class="text-sm">
            I understand that submitted questions may be featured on the site
          </Label>
        </div>
      </div>

      <Button type="submit" class="rx-submit mt-4" disabled={!agreeToTerms}>
        SUBMIT REQUEST
      </Button>
    </form>

    <!-- Prescription Footer -->
    <div class="rx-footer">
      <p class="rx-small">
        Side effects may include: perspective shifts, uncomfortable truths, and
        personal growth.
      </p>
    </div>
  </div>
</div>

<style>
  .prescription-container {
    background-color: white;
    border: 2px solid #333;
    padding: 1.5rem;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    max-width: 600px;
    margin: 0 auto;
    background-image:
      linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .rx-symbol {
    font-family: serif;
    font-size: 2rem;
    font-weight: bold;
    opacity: 0.8;
  }

  .rx-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
  }

  .rx-title {
    text-align: center;
  }

  .rx-info {
    text-align: right;
    font-family: monospace;
    font-size: 0.8rem;
  }

  .rx-info span {
    font-weight: bold;
  }

  .rx-line {
    height: 1px;
    background-color: #333;
    margin: 1rem 0;
    position: relative;
  }

  .rx-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 640px) {
    .rx-grid {
      grid-template-columns: 1fr;
    }
  }

  .rx-section {
    margin-bottom: 0.75rem;
  }

  .rx-label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
    font-family: monospace;
    font-size: 0.8rem;
  }

  .rx-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: sans-serif;
    height: 38px;
  }

  .rx-checkboxes {
    margin: 0.75rem 0;
    font-size: 0.9rem;
  }

  .rx-submit {
    background-color: #553c9a;
    color: white;
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: bold;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .rx-submit:hover {
    background-color: #6b46c1;
  }

  .rx-submit:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .rx-footer {
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px dashed #333;
    font-family: monospace;
    font-size: 0.8rem;
    text-align: center;
  }

  .rx-small {
    font-size: 0.75rem;
    color: #666;
  }
</style>

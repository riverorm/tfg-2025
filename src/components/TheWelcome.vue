<script setup>
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="welcome">
    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Documentation</template>
      <p>Check out the documentation to get started.</p>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>Tooling</template>
      <p>Explore the tooling available for your project.</p>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>Ecosystem</template>
      <p>Discover the ecosystem of plugins and integrations.</p>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>Community</template>
      <p>Join the community and connect with other developers.</p>
    </WelcomeItem>

    <WelcomeItem @click="openReadmeInEditor">
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>Support</template>
      <p>Need help? Check out our support options.</p>
    </WelcomeItem>

  </div>
</template>
